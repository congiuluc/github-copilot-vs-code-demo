namespace TodoApi.Models;

public record UpdateTodoRequest(string Title, string? Description, bool IsCompleted);
