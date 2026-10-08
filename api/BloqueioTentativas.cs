using System.Collections.Concurrent;

namespace MyPerson.Api;

public sealed class BloqueioTentativas
{
    public const int MaxFalhas = 5;
    public static readonly TimeSpan Duracao = TimeSpan.FromMinutes(15);
    public const string Mensagem = "Muitas tentativas. Tente novamente em instantes.";

    // ponytail: vale só neste processo e até 1000 chaves; com várias instâncias, o upgrade é um store compartilhado
    private const int Teto = 1000;
    private readonly ConcurrentDictionary<string, Estado> _estados = new();

    public bool Bloqueado(string chave, DateTime agora, out int retryAfterSeconds)
    {
        retryAfterSeconds = 0;
        if (!_estados.TryGetValue(chave, out var estado) || estado.BloqueadoAte is not { } ate || ate <= agora)
            return false;

        retryAfterSeconds = Math.Max(1, (int)Math.Ceiling((ate - agora).TotalSeconds));
        return true;
    }

    public void RegistrarFalha(string chave, DateTime agora)
    {
        if (_estados.Count >= Teto && !_estados.ContainsKey(chave))
            _estados.Clear();

        _estados.AddOrUpdate(
            chave,
            _ => Criar(1, agora),
            (_, atual) =>
            {
                if (atual.BloqueadoAte is { } ate && ate > agora)
                    return atual;

                var falhas = atual.BloqueadoAte != null ? 1 : atual.Falhas + 1;
                return Criar(falhas, agora);
            });
    }

    public void RegistrarSucesso(string chave) => _estados.TryRemove(chave, out _);

    public static string ChaveAdmin(string username) => "admin:" + username.Trim().ToLowerInvariant();

    public static string ChaveCliente(string email) => "cliente:" + email.Trim().ToLowerInvariant();

    private static Estado Criar(int falhas, DateTime agora) =>
        new(falhas, falhas >= MaxFalhas ? agora.Add(Duracao) : null);

    private sealed record Estado(int Falhas, DateTime? BloqueadoAte);
}
