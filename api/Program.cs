using Microsoft.EntityFrameworkCore;
using MyPerson.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure Entity Framework Core with PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? builder.Configuration["ConnectionStrings:DefaultConnection"]
    ?? "Host=postgres;Port=5432;Database=myperson;Username=myperson;Password=myperson123";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(c =>{
        c.RouteTemplate = "api/swagger/{documentName}/swagger.json";
    });
    app.UseSwaggerUI(c =>{
        c.SwaggerEndpoint("/api/swagger/v1/swagger.json", "MyPerson API v1");
        c.RoutePrefix = "api/swagger";
    });
}

app.UseCors("AllowAll");

app.UseAuthorization();

// Configure routing to accept /api/ as base prefix
app.MapControllers().RequireCors("AllowAll");

app.Run();

