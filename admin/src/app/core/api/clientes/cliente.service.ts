import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CLIENTES_ENDPOINT,
  CLIENTES_REGISTRO_ENDPOINT,
} from '../../../shared/constants/api.constants';
import {
  AtualizarClienteRequest,
  Cliente,
  CriarClienteRequest,
} from '../../../shared/models/cliente/cliente.model';
import { RestService } from '../../services/rest/rest.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly rest = inject(RestService);

  listar(): Observable<Cliente[]> {
    return this.rest.get<Cliente[]>(this.rest.getApiUrl(CLIENTES_ENDPOINT));
  }

  buscarPorId(id: number): Observable<Cliente> {
    return this.rest.get<Cliente>(this.rest.getApiUrl(`${CLIENTES_ENDPOINT}/${id}`));
  }

  criar(cliente: CriarClienteRequest): Observable<Cliente> {
    // ponytail: o endpoint de criação de cliente na API é público (/clientes/registro);
    // no admin reutilizamos esse mesmo endpoint, sem enviar token.
    return this.rest.post<Cliente>(
      this.rest.getApiUrl(CLIENTES_REGISTRO_ENDPOINT),
      cliente,
      undefined,
      false,
      false,
    );
  }

  atualizar(id: number, cliente: AtualizarClienteRequest): Observable<void> {
    return this.rest.put<void>(this.rest.getApiUrl(`${CLIENTES_ENDPOINT}/${id}`), cliente);
  }

  excluir(id: number): Observable<void> {
    return this.rest.delete<void>(this.rest.getApiUrl(`${CLIENTES_ENDPOINT}/${id}`));
  }
}
