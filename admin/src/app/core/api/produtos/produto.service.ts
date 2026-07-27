import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PRODUTOS_ENDPOINT } from '../../../shared/constants/api.constants';
import {
  AtualizarProdutoRequest,
  CriarProdutoRequest,
  Produto,
} from '../../../shared/models/produto/produto.model';
import { RestService } from '../../services/rest/rest.service';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private readonly rest = inject(RestService);

  listar(): Observable<Produto[]> {
    return this.rest.get<Produto[]>(this.rest.getApiUrl(PRODUTOS_ENDPOINT));
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.rest.get<Produto>(this.rest.getApiUrl(`${PRODUTOS_ENDPOINT}/${id}`));
  }

  criar(produto: CriarProdutoRequest): Observable<Produto> {
    return this.rest.post<Produto>(this.rest.getApiUrl(PRODUTOS_ENDPOINT), produto);
  }

  atualizar(id: number, produto: AtualizarProdutoRequest): Observable<void> {
    return this.rest.put<void>(this.rest.getApiUrl(`${PRODUTOS_ENDPOINT}/${id}`), produto);
  }

  excluir(id: number): Observable<void> {
    return this.rest.delete<void>(this.rest.getApiUrl(`${PRODUTOS_ENDPOINT}/${id}`));
  }
}
