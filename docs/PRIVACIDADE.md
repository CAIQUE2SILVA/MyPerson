# Tratamento de Dados Pessoais — MyPerson

Este documento descreve como o projeto MyPerson trata dados pessoais, em alinhamento com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018) e o GDPR quando aplicável.

> **Nota:** este documento registra o estado observado do repositório. Decisões jurídicas formais devem ser validadas por responsável humano e/ou equipe de compliance.

## Dados pessoais tratados

O sistema coleta e armazena dados pessoais de **clientes** no cadastro público:

| Dado | Finalidade | Onde é armazenado | Evidência |
|------|------------|-------------------|-----------|
| Nome | Identificação do cliente | Tabela `Clientes` | `api/Models/Cliente.cs` |
| E-mail | Login/contato e identificador único | Tabela `Clientes` (índice único) | `api/Data/ApplicationDbContext.cs` |
| Telefone | Contato | Tabela `Clientes` | `api/Models/Cliente.cs` |
| Senha | Autenticação | Tabela `Clientes` (hash) | `api/Controllers/ClientesController.cs` |

## Base legal presumida

A coleta ocorre mediante **consentimento** do titular no momento do registro (`POST /api/clientes/registro`). O admin autenticado pode listar, visualizar, alterar e remover clientes.

## Segurança

- Senhas são armazenadas como hash via `PasswordHasher<Cliente>`.
- Endpoints de escrita e listagem de clientes exigem autenticação JWT (`[Authorize]`).
- O registro de cliente (`POST /api/clientes/registro`) é público por design, mas deve ser protegido contra bots e abuso.
- Comunicação em produção deve usar HTTPS configurado no Nginx.

## Direitos do titular

O sistema deve permitir, futuramente, que o titular exercite os direitos previstos na LGPD:

- Confirmação da existência de tratamento.
- Acesso aos dados.
- Correção de dados incompletos ou desatualizados.
- Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos.
- Portabilidade.
- Eliminação dos dados pessoais (exceto quando houver base legal para retenção).
- Revogação do consentimento.

Hoje, o admin pode executar exclusão e atualização via API. Mecanismos de autoatendimento pelo cliente ainda não estão implementados.

## Retenção

- Dados de clientes são mantidos enquanto houver relação ativa com o sistema ou base legal para retenção.
- Excluir um cliente via `DELETE /api/clientes/{id}` remove o registro do banco de dados.

## Responsável

- **Responsável técnico:** a definir pelo time.
- **DPO (Encarregado):** a definir, conforme obrigatoriedade da LGPD.

## Riscos e pendências

- Não há política explícita de consentimento registrada no frontend/admin.
- Não há mecanismo de anonimização ou exportação de dados do titular.
- Logs de erro da API (`ILogger`) podem conter dados pessoais se não forem sanitizados.
- Recomenda-se revisar se o admin deve expor e-mail/telefone de clientes em listagens.

## Validação humana necessária

1. Confirmar se a base legal escolhida (consentimento) é a correta para o negócio.
2. Definir prazo de retenção e procedimento de eliminação.
3. Decidir se clientes terão autoatendimento para acessar/corrigir/excluir dados.
4. Revisar se listagens administrativas devem mascarar dados sensíveis.

## Documentação relacionada

- [api/API.md](../api/API.md) — endpoints de clientes
- [docs/ARCHITECTURE.md](./ARCHITECTURE.md) — padrões de segurança e camadas
- [docs/TESTING.md](./TESTING.md) — política de testes, incluindo dados pessoais
- [docs/PROJETO.md](./PROJETO.md) — visão geral do sistema
