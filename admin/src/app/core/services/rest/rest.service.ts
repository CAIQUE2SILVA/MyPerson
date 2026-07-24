import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/enviroment';
import { NotificationService } from '../notification/notification.service';
import { ACCESS_TOKEN_KEY, StorageService } from '../storage/storage.service';

export interface HttpParamsObject {
  [key: string]: string | number | boolean | Date | Array<string | number | boolean> | null | undefined;
}

/**
 * Cliente HTTP genérico para consumo da API MyPerson.
 *
 * Segue o padrão de um wrapper reutilizável em cima do HttpClient com:
 * - flag `authenticate` para anexar o token Bearer;
 * - flag `errorAlert` para exibir automaticamente uma notificação de erro;
 * - normalização de query params (datas em ISO, remoção de valores nulos).
 *
 * Adaptações em relação ao exemplo mobile (Ionic/Capacitor):
 * - o alerta de erro usa o `NotificationService` (PrimeNG) em vez do `AlertController`;
 * - o token é lido via `StorageService` (SSR-safe) em vez do storage do Capacitor;
 * - sem feedback háptico/sonoro (contexto web).
 */
@Injectable({
  providedIn: 'root',
})
export class RestService {
  private readonly http = inject(HttpClient);
  private readonly notification = inject(NotificationService);
  private readonly storageService = inject(StorageService);

  get<T>(url: string, parameters?: HttpParamsObject, authenticate = true, errorAlert = true): Observable<T> {
    let params: HttpParams | undefined = undefined;
    let headers: { [header: string]: string } | undefined = undefined;

    parameters = this.convertDatesToIsoStrings(parameters);

    if (parameters) {
      params = this.buildHttpParams(parameters);
      params = this.removeNullValuesFromQueryParams(params);
    }

    if (authenticate) {
      headers = this.buildAuthHeaders();
    }

    return this.http.get<T>(url, { params, headers })
      .pipe(
        catchError((err: HttpErrorResponse) => this.handleError(err, errorAlert)),
      );
  }

  put<T>(action: string, body?: unknown | FormData | string, parameters?: HttpParamsObject, authenticate = true, errorAlert = true): Observable<T> {
    let params: HttpParams | undefined = undefined;

    parameters = this.convertDatesToIsoStrings(parameters);

    if (parameters) {
      params = new HttpParams({ fromObject: parameters as { [key: string]: string } });
    }

    const headers = authenticate ? this.buildAuthHeaders() : {};

    return this.http.put<T>(action, body, { params, headers })
      .pipe(
        catchError((err: HttpErrorResponse) => this.handleError(err, errorAlert)),
      );
  }

  post<T>(action: string, body?: unknown | FormData | string, parameters?: HttpParamsObject, authenticate = true, errorAlert = true): Observable<T> {
    let params: HttpParams | undefined = undefined;

    parameters = this.convertDatesToIsoStrings(parameters);

    if (parameters) {
      params = new HttpParams({ fromObject: parameters as { [key: string]: string } });
    }

    const headers = authenticate ? this.buildAuthHeaders() : {};

    return this.http.post<T>(action, body, { params, headers })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 200 && err.error && typeof err.error === 'object' && 'text' in err.error) {
            return of(err.error.text as T);
          }
          return this.handleError(err, errorAlert);
        }),
      );
  }

  patch<T>(action: string, body?: unknown | FormData | string, parameters?: HttpParamsObject, authenticate = true, errorAlert = true): Observable<T> {
    let params: HttpParams | undefined = undefined;

    parameters = this.convertDatesToIsoStrings(parameters);

    if (parameters) {
      params = new HttpParams({ fromObject: parameters as { [key: string]: string } });
    }

    const headers = authenticate ? this.buildAuthHeaders() : {};

    return this.http.patch<T>(action, body, { params, headers })
      .pipe(
        catchError((err: HttpErrorResponse) => this.handleError(err, errorAlert)),
      );
  }

  delete<T>(action: string, authenticate = true, errorAlert = true): Observable<T> {
    const headers: { [header: string]: string } = {
      'Content-Type': 'application/json; charset=utf-8',
    };

    if (authenticate) {
      Object.assign(headers, this.buildAuthHeaders());
    }

    return this.http.delete<T>(action, { headers })
      .pipe(
        catchError((err: HttpErrorResponse) => this.handleError(err, errorAlert)),
      );
  }

  postText(action: string, body?: unknown | FormData | string, parameters?: HttpParamsObject, authenticate = true, errorAlert = true): Observable<string> {
    let params: HttpParams | undefined = undefined;

    parameters = this.convertDatesToIsoStrings(parameters);

    if (parameters) {
      params = new HttpParams({ fromObject: parameters as { [key: string]: string } });
    }

    const headers = authenticate ? this.buildAuthHeaders() : {};

    return this.http.post(action, body, { params, headers, responseType: 'text' })
      .pipe(
        catchError((err: HttpErrorResponse) => this.handleError(err, errorAlert)),
      );
  }

  /**
   * Monta a URL completa de um endpoint.
   * A API MyPerson não é versionada (rotas em `/api/...`), portanto apenas
   * concatenamos a base (`environment.apiURL`) com a ação.
   */
  getApiUrl(action: string): string {
    const base = environment.apiURL.replace(/\/$/, '');
    const cleanAction = action.replace(/^\//, '');
    return `${base}/${cleanAction}`;
  }

  private buildAuthHeaders(): { [header: string]: string } {
    const userToken = this.storageService.get(ACCESS_TOKEN_KEY);
    return userToken ? { authorization: `Bearer ${userToken}` } : {};
  }

  private removeNullValuesFromQueryParams(params: HttpParams): HttpParams {
    const keys = params.keys();
    let newParams = new HttpParams();

    keys.forEach((key) => {
      const allValues = params.getAll(key);
      if (allValues && allValues.length > 0) {
        allValues.forEach((value) => {
          if (value !== null && value !== 'null' && value !== 'undefined' && value !== undefined && value !== '') {
            newParams = newParams.append(key, value);
          }
        });
      } else {
        const value = params.get(key);
        if (value !== null && value !== 'null' && value !== 'undefined' && value !== undefined && value !== '') {
          newParams = newParams.set(key, value);
        }
      }
    });

    return newParams;
  }

  private handleError(err: HttpErrorResponse, errorAlert: boolean): Observable<never> {
    let msg = 'Ocorreu um erro';

    if (err) {
      msg = err.message || 'Ocorreu um erro';

      if (err.error != null) {
        if (Array.isArray(err.error.errors)) {
          msg = err.error.errors.join(', ');
        } else if (err.error.message) {
          msg = err.error.message;
        } else if (typeof err.error === 'string') {
          msg = err.error;
        }
      }
    }

    if (errorAlert) {
      this.notification.error(msg);
    }

    return throwError(() => new Error(msg));
  }

  private convertDatesToIsoStrings(params?: HttpParamsObject): HttpParamsObject | undefined {
    if (!params) {
      return params;
    }

    return Object.entries(params).reduce((acc, [key, value]) => {
      if (value != null && typeof value === 'object' && value instanceof Date) {
        acc[key] = value.toISOString();
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as HttpParamsObject);
  }

  private buildHttpParams(parameters: HttpParamsObject): HttpParams {
    let params = new HttpParams();

    Object.keys(parameters).forEach((key) => {
      const value = parameters[key];

      if (value != null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item != null && item !== undefined && String(item) !== '') {
              params = params.append(key, String(item));
            }
          });
        } else {
          params = params.set(key, String(value));
        }
      }
    });

    return params;
  }
}
