using System.Net;
using System.Threading.RateLimiting;

namespace MyPerson.Api;

public static class AuthRateLimit
{
    public const string Policy = "auth";

    // 5 requisições por minuto por IP. O bloqueio por conta fica em BloqueioTentativas.
    public const int PermitLimit = 5;
    public static readonly TimeSpan Window = TimeSpan.FromMinutes(1);

    public static string ClientKey(IPAddress? address) => address?.ToString() ?? "unknown";

    public static FixedWindowRateLimiterOptions CreateOptions() => new()
    {
        PermitLimit = PermitLimit,
        Window = Window,
        QueueLimit = 0
    };
}
