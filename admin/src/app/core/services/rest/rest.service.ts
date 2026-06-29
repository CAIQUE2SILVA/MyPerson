import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';

import { environment } from '../../../../environments/enviroment';
import { LoadingService } from '../loading/loading.service';
import { NotificationService } from '../notification/notification.service';

export type HttpParamsValue = string | number | boolean | Date;

export type HttpParamsObject = Record<
  string,
  HttpParamsValue | ReadonlyArray<HttpParamsValue> | null | undefined
>;

export interface RestOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?: HttpParams | HttpParamsObject;
  showError?: boolean;
  showSuccess?: boolean;
  successMessage?: string;
  showLoading?: boolean;
}

interface ApiErrorBody {
  errors?: string[] | Record<string, string[]>;
  message?: string;
  title?: string;
  detail?: string;
}

const IGNORED_PARAM_VALUES = new Set(['', 'null', 'undefined']);

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private readonly http = inject(HttpClient);
  private readonly notification = inject(NotificationService);
  private readonly loading = inject(LoadingService);
  private readonly baseUrl = environment.apiURL.replace(/\/$/, '');

  get<T>(path: string, options?: RestOptions): Observable<T> {
    return this.request(
      this.http.get<T>(this.buildUrl(path), this.buildHttpOptions(options)),
      options,
    );
  }

  post<T>(path: string, body: unknown, options?: RestOptions): Observable<T> {
    return this.request(
      this.http.post<T>(this.buildUrl(path), body, this.buildHttpOptions(options)),
      options,
    );
  }

  put<T>(path: string, body: unknown, options?: RestOptions): Observable<T> {
    return this.request(
      this.http.put<T>(this.buildUrl(path), body, this.buildHttpOptions(options)),
      options,
    );
  }

  patch<T>(path: string, body: unknown, options?: RestOptions): Observable<T> {
    return this.request(
      this.http.patch<T>(this.buildUrl(path), body, this.buildHttpOptions(options)),
      options,
    );
  }

  delete<T>(path: string, options?: RestOptions): Observable<T> {
    return this.request(
      this.http.delete<T>(this.buildUrl(path), this.buildHttpOptions(options)),
      options,
    );
  }

  private request<T>(source: Observable<T>, options?: RestOptions): Observable<T> {
    const showError = options?.showError ?? true;
    const showSuccess = options?.showSuccess ?? false;
    const showLoading = options?.showLoading ?? false;
    const successMessage = options?.successMessage ?? 'Operação realizada com sucesso';

    if (showLoading) {
      this.loading.show();
    }

    return source.pipe(
      tap(() => {
        if (showSuccess) {
          this.notification.success(successMessage);
        }
      }),
      catchError((err: HttpErrorResponse) => this.handleError(err, showError)),
      finalize(() => {
        if (showLoading) {
          this.loading.hide();
        }
      }),
    );
  }

  private handleError(err: HttpErrorResponse, showError: boolean): Observable<never> {
    const msg = this.extractErrorMessage(err);

    if (showError) {
      this.notification.error(msg);
    }

    return throwError(() => new Error(msg));
  }

  private extractErrorMessage(err: HttpErrorResponse): string {
    const body = err.error as ApiErrorBody | string | Record<string, unknown> | null;

    if (typeof body === 'string' && body.trim().length > 0) {
      return body.trim();
    }

    if (body && typeof body === 'object') {
      const apiError = body as ApiErrorBody;

      if (Array.isArray(apiError.errors) && apiError.errors.length > 0) {
        return apiError.errors.join(', ');
      }

      if (apiError.errors && typeof apiError.errors === 'object' && !Array.isArray(apiError.errors)) {
        const messages = Object.values(apiError.errors)
          .flat()
          .filter((message): message is string => typeof message === 'string' && message.length > 0);

        if (messages.length > 0) {
          return messages.join(', ');
        }
      }

      if (apiError.detail) {
        return apiError.detail;
      }

      if (apiError.title) {
        return apiError.title;
      }

      if (apiError.message) {
        return apiError.message;
      }

      const modelStateMessages = this.extractModelStateMessages(
        body as Record<string, unknown>,
      );
      if (modelStateMessages.length > 0) {
        return modelStateMessages.join(', ');
      }
    }

    return err.message || 'Ocorreu um erro';
  }

  private extractModelStateMessages(body: Record<string, unknown>): string[] {
    const skipKeys = new Set(['type', 'title', 'status', 'detail', 'instance', 'traceId', 'errors']);
    const messages: string[] = [];

    for (const [key, value] of Object.entries(body)) {
      if (skipKeys.has(key)) {
        continue;
      }

      if (Array.isArray(value)) {
        messages.push(...value.filter((message): message is string => typeof message === 'string'));
        continue;
      }

      if (typeof value === 'string') {
        messages.push(value);
      }
    }

    return messages;
  }

  private buildUrl(path: string): string {
    const cleanPath = path.replace(/^\//, '');
    return `${this.baseUrl}/${cleanPath}`;
  }

  private buildHttpOptions(
    options?: RestOptions,
  ): { headers?: RestOptions['headers']; params?: HttpParams } {
    if (!options) {
      return {};
    }

    return {
      headers: options.headers,
      params: this.toHttpParams(options.params),
    };
  }

  private toHttpParams(params?: HttpParams | HttpParamsObject): HttpParams | undefined {
    if (!params) {
      return undefined;
    }

    if (params instanceof HttpParams) {
      return params;
    }

    const normalizedParams = this.convertDatesToIsoStrings(params);
    let httpParams = new HttpParams();

    for (const [key, value] of Object.entries(normalizedParams)) {
      if (this.shouldSkipParam(value)) {
        continue;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          if (this.shouldSkipParam(item)) {
            continue;
          }

          httpParams = httpParams.append(key, String(item));
        }
        continue;
      }

      httpParams = httpParams.set(key, String(value));
    }

    return httpParams;
  }

  private convertDatesToIsoStrings(params: HttpParamsObject): HttpParamsObject {
    const result: HttpParamsObject = {};

    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === undefined) {
        continue;
      }

      if (value instanceof Date) {
        result[key] = value.toISOString();
        continue;
      }

      if (Array.isArray(value)) {
        result[key] = value.map((item) => (item instanceof Date ? item.toISOString() : item));
        continue;
      }

      result[key] = value;
    }

    return result;
  }

  private shouldSkipParam(value: unknown): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === 'string') {
      return IGNORED_PARAM_VALUES.has(value.trim().toLowerCase());
    }

    return false;
  }
}
