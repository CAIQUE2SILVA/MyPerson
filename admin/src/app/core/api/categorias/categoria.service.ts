import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CATEGORIAS_ENDPOINT } from '../../../shared/constants/api.constants';
import {
  AtualizarCategoriaRequest,
  Categoria,
  CriarCategoriaRequest,
} from '../../../shared/models/categoria/categoria.model';
import { RestService } from '../../services/rest/rest.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private readonly rest = inject(RestService);

  listar(): Observable<Categoria[]> {
    return this.rest.get<Categoria[]>(this.rest.getApiUrl(CATEGORIAS_ENDPOINT));
  }

  buscarPorId(id: number): Observable<Categoria> {
    return this.rest.get<Categoria>(this.rest.getApiUrl(`${CATEGORIAS_ENDPOINT}/${id}`));
  }

  criar(categoria: CriarCategoriaRequest): Observable<Categoria> {
    return this.rest.post<Categoria>(this.rest.getApiUrl(CATEGORIAS_ENDPOINT), categoria);
  }

  atualizar(id: number, categoria: AtualizarCategoriaRequest): Observable<void> {
    return this.rest.put<void>(this.rest.getApiUrl(`${CATEGORIAS_ENDPOINT}/${id}`), categoria);
  }

  excluir(id: number): Observable<void> {
    return this.rest.delete<void>(this.rest.getApiUrl(`${CATEGORIAS_ENDPOINT}/${id}`));
  }
}
