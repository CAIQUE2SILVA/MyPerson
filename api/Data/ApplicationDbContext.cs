using Microsoft.EntityFrameworkCore;

namespace MyPerson.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSets serão adicionados aqui conforme necessário
    // Exemplo:
    // public DbSet<User> Users { get; set; }
}

