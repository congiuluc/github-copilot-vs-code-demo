using TodoApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add CORS support for frontend integration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// In-memory storage for demonstration purposes
var todos = new List<TodoItem>();
var nextId = 1;

// Add some sample data
todos.AddRange(new[]
{
    new TodoItem
    {
        Id = nextId++,
        Title = "Setup development environment",
        Description = "Install .NET 10 SDK and configure VS Code",
        IsCompleted = true,
        CreatedAt = DateTime.UtcNow.AddDays(-2),
        UpdatedAt = DateTime.UtcNow.AddDays(-1)
    },
    new TodoItem
    {
        Id = nextId++,
        Title = "Create Todo API",
        Description = "Build REST API with CRUD operations for todos",
        IsCompleted = false,
        CreatedAt = DateTime.UtcNow.AddDays(-1),
        UpdatedAt = DateTime.UtcNow.AddDays(-1)
    },
    new TodoItem
    {
        Id = nextId++,
        Title = "Write documentation",
        Description = "Create comprehensive README with API documentation",
        IsCompleted = false,
        CreatedAt = DateTime.UtcNow.AddHours(-2),
        UpdatedAt = DateTime.UtcNow.AddHours(-2)
    }
});

// GET all todos
app.MapGet("/api/todos", () => Results.Ok(todos))
    .WithName("GetTodos");

// GET todo by ID
app.MapGet("/api/todos/{id}", (int id) =>
{
    var todo = todos.FirstOrDefault(t => t.Id == id);
    return todo != null ? Results.Ok(todo) : Results.NotFound();
})
.WithName("GetTodoById");

// POST create new todo
app.MapPost("/api/todos", (CreateTodoRequest request) =>
{
    var todo = new TodoItem
    {
        Id = nextId++,
        Title = request.Title,
        Description = request.Description,
        IsCompleted = false,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };
    
    todos.Add(todo);
    return Results.Created($"/api/todos/{todo.Id}", todo);
})
.WithName("CreateTodo");

// PUT update todo
app.MapPut("/api/todos/{id}", (int id, UpdateTodoRequest request) =>
{
    var todo = todos.FirstOrDefault(t => t.Id == id);
    if (todo == null)
        return Results.NotFound();

    todo.Title = request.Title;
    todo.Description = request.Description;
    todo.IsCompleted = request.IsCompleted;
    todo.UpdatedAt = DateTime.UtcNow;

    return Results.Ok(todo);
})
.WithName("UpdateTodo");

// PATCH toggle todo completion
app.MapPatch("/api/todos/{id}/toggle", (int id) =>
{
    var todo = todos.FirstOrDefault(t => t.Id == id);
    if (todo == null)
        return Results.NotFound();

    todo.IsCompleted = !todo.IsCompleted;
    todo.UpdatedAt = DateTime.UtcNow;

    return Results.Ok(todo);
})
.WithName("ToggleTodo");

// DELETE todo
app.MapDelete("/api/todos/{id}", (int id) =>
{
    var todo = todos.FirstOrDefault(t => t.Id == id);
    if (todo == null)
        return Results.NotFound();

    todos.Remove(todo);
    return Results.NoContent();
})
.WithName("DeleteTodo");

// GET todos with filters
app.MapGet("/api/todos/filter", (bool? completed, string? search) =>
{
    var filteredTodos = todos.AsEnumerable();

    if (completed.HasValue)
        filteredTodos = filteredTodos.Where(t => t.IsCompleted == completed.Value);

    if (!string.IsNullOrEmpty(search))
        filteredTodos = filteredTodos.Where(t => 
            t.Title.Contains(search, StringComparison.OrdinalIgnoreCase) ||
            (t.Description != null && t.Description.Contains(search, StringComparison.OrdinalIgnoreCase)));

    return Results.Ok(filteredTodos.ToList());
})
.WithName("FilterTodos");

// Weather Forecast endpoints
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/api/weather", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = summaries[Random.Shared.Next(summaries.Length)]
        })
        .ToArray();
    
    return Results.Ok(forecast);
})
.WithName("GetWeatherForecast");

app.Run();
