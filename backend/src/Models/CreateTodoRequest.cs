namespace TodoApi.Models;

public record CreateTodoRequest(string Title, string? Description = null);
