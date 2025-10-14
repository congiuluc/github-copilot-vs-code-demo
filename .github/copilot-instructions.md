# GitHub Copilot Custom Instructions - Todo App Project

## Project Overview

This is a full-stack TODO application built with:
- **Backend**: ASP.NET Core 10 Minimal API
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Orchestration**: .NET Aspire for local development
- **Architecture**: RESTful API with in-memory storage

## Technology Stack

### Backend (.NET)
- **Framework**: ASP.NET Core 10 (Minimal APIs)
- **Language**: C# 13
- **API Style**: RESTful with OpenAPI/Swagger
- **Data Storage**: In-memory collections (for demo purposes)
- **CORS**: Enabled for frontend integration

### Frontend (React)
- **Framework**: React 18.3+ with TypeScript
- **Build Tool**: Vite 5.4+
- **Styling**: Tailwind CSS 3.4+ with custom utilities
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Fetch API
- **UI Libraries**: 
  - `lucide-react` for icons
  - `react-hot-toast` for notifications
- **Type Safety**: Strict TypeScript configuration

### Orchestration
- **.NET Aspire**: Service orchestration and local development
- Manages both backend API and frontend Vite dev server

## Project Structure

```
repo/
├── aspire/           # .NET Aspire AppHost for orchestration
│   └── AppHost.cs    # Service configuration and endpoints
├── backend/src/      # ASP.NET Core API
│   ├── Program.cs    # API endpoints and configuration
│   └── Models/       # Data models and DTOs
└── frontend/         # React + TypeScript frontend
    └── src/
        ├── App.tsx   # Main component with todo management
        ├── api.ts    # API client functions
        └── types.ts  # TypeScript interfaces
```

## Code Style and Conventions

### C# Backend Guidelines

1. **API Endpoints**
   - Use Minimal API syntax with `app.MapGet/Post/Put/Patch/Delete`
   - Always include `.WithName()` for endpoint naming
   - Return appropriate HTTP status codes via `Results.*`
   - Use route prefixes: `/api/todos` for all todo endpoints

2. **Naming Conventions**
   - PascalCase for classes, properties, and public methods
   - camelCase for local variables and parameters
   - Use descriptive names: `CreateTodoRequest` not `CreateDto`

3. **Models**
   - Place all models in `TodoApi.Models` namespace
   - Use nullable reference types appropriately (`string?`)
   - Include validation attributes when appropriate
   - Use `DateTime.UtcNow` for timestamps

4. **Response Patterns**
   ```csharp
   // Good: Use Results helpers
   return Results.Ok(data);
   return Results.Created($"/api/todos/{id}", data);
   return Results.NotFound();
   return Results.NoContent();
   ```

### React/TypeScript Frontend Guidelines

1. **Component Structure**
   - Functional components with TypeScript
   - Use React Hooks for state and effects
   - Extract reusable logic into custom hooks when appropriate

2. **State Management**
   - Use `useState` for component state
   - Use `useEffect` for side effects and data loading
   - Keep state as close to where it's used as possible

3. **API Integration**
   - All API calls go through `api.ts`
   - Use async/await for asynchronous operations
   - Handle errors with try/catch and display toast notifications
   - Type all API responses with interfaces from `types.ts`

4. **Styling**
   - Use Tailwind CSS utility classes
   - Custom classes defined: `glass-effect`, `btn-primary`, `btn-secondary`, `todo-card`, `input-field`
   - Prefer composition over custom CSS
   - Use gradients and shadows for modern UI feel

5. **User Feedback**
   - Use `react-hot-toast` for all notifications
   - Include emoji in success messages: `toast.success('Todo created! 🎉')`
   - Show error messages clearly: `toast.error('Failed to load todos')`

6. **TypeScript**
   - Define interfaces in `types.ts`
   - Use strict type checking
   - Avoid `any` type unless absolutely necessary
   - Use optional properties (`?`) appropriately

## API Endpoints Reference

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| GET | `/api/todos` | Get all todos | - | `Todo[]` |
| GET | `/api/todos/{id}` | Get todo by ID | - | `Todo` or 404 |
| POST | `/api/todos` | Create new todo | `CreateTodoRequest` | `Todo` (201) |
| PUT | `/api/todos/{id}` | Update todo | `UpdateTodoRequest` | `Todo` or 404 |
| PATCH | `/api/todos/{id}/toggle` | Toggle completion | - | `Todo` or 404 |
| DELETE | `/api/todos/{id}` | Delete todo | - | 204 or 404 |
| GET | `/api/todos/filter` | Filter todos | Query: `completed`, `search` | `Todo[]` |

## Data Models

### TodoItem (C#)
```csharp
public class TodoItem
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### Todo (TypeScript)
```typescript
interface Todo {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Common Patterns

### Adding New API Endpoint

1. Add endpoint in `backend/src/Program.cs`:
   ```csharp
   app.MapGet("/api/todos/stats", () => 
   {
       var stats = new { total = todos.Count };
       return Results.Ok(stats);
   })
   .WithName("GetTodoStats");
   ```

2. Add API function in `frontend/src/api.ts`:
   ```typescript
   async getTodoStats() {
     const response = await fetch(`${API_BASE_URL}/api/todos/stats`);
     if (!response.ok) throw new Error('Failed to fetch stats');
     return response.json();
   }
   ```

3. Add type definition in `frontend/src/types.ts` if needed

### Adding New Feature to Frontend

1. Add state if needed: `const [feature, setFeature] = useState(initialValue);`
2. Create handler functions with proper error handling
3. Update UI with Tailwind classes
4. Add toast notifications for user feedback
5. Ensure TypeScript types are properly defined

## Development Guidelines

### When Adding Features

- **Backend First**: Define the API endpoint and test it
- **Type Safety**: Update TypeScript interfaces when changing data models
- **Consistent Naming**: Keep C# and TypeScript property names aligned (consider casing)
- **Error Handling**: Always include try/catch in async operations
- **User Feedback**: Show loading states and success/error messages

### Performance Considerations

- Use React memo/callback hooks if components re-render unnecessarily
- Debounce search input if implementing real-time search
- Consider pagination for large todo lists

### Accessibility

- Use semantic HTML elements
- Include proper ARIA labels for interactive elements
- Ensure keyboard navigation works
- Maintain sufficient color contrast

### Testing Recommendations

- Test API endpoints with the `.http` file in `backend/src/TodoApi.http`
- Validate form inputs before submission
- Handle edge cases (empty lists, network failures, etc.)

## Environment and Configuration

### Backend
- Runs on HTTPS with development certificates
- OpenAPI enabled in Development environment
- CORS configured with "AllowAll" policy (restrictive for production)

### Frontend
- API URL configured via environment variable: `VITE_API_URL`
- Dev server managed by Aspire
- Hot module replacement enabled

### Aspire
- Orchestrates both backend and frontend services
- Manages service discovery and environment variables
- External HTTP endpoints exposed for both services

## Security Considerations

- **Current State**: In-memory storage, no authentication (demo/POC)
- **Future Enhancements**: 
  - Add authentication/authorization
  - Implement input validation and sanitization
  - Restrict CORS to specific origins
  - Add rate limiting
  - Implement proper data persistence

## Best Practices for This Project

1. **Maintain Type Consistency**: Keep C# models and TypeScript interfaces in sync
2. **RESTful Conventions**: Follow REST principles for API design
3. **Immutable Updates**: Use spread operators for state updates in React
4. **Descriptive Naming**: Use clear, intention-revealing names
5. **Error Messages**: Provide helpful error messages to users
6. **Code Organization**: Keep related code together (models, API functions, etc.)
7. **Documentation**: Comment complex business logic, not obvious code
8. **Responsive Design**: Ensure UI works on mobile and desktop

## When Generating Code

- **Follow existing patterns** in the codebase
- **Use the same libraries** already in package.json/csproj
- **Match the coding style** of existing files
- **Include error handling** for all async operations
- **Add TypeScript types** for all new data structures
- **Use Tailwind classes** that match the existing design system
- **Include toast notifications** for user actions
- **Test endpoints** by suggesting .http file additions
- **Consider mobile responsiveness** when adding UI components
- **Keep performance in mind** - this is a lightweight demo app

## Common Tasks

### Add a New Todo Property

1. Update `TodoItem` class in C#
2. Update `Todo` interface in TypeScript
3. Update `CreateTodoRequest` and `UpdateTodoRequest` as needed
4. Modify API endpoints to handle new property
5. Update UI to display/edit the new property

### Add Filtering/Sorting

1. Add query parameters to GET endpoint
2. Implement filtering logic in backend
3. Add filter controls in frontend UI
4. Update API client function
5. Add state management for filter options

### Add Persistence

1. Install Entity Framework Core packages
2. Create DbContext and configure
3. Replace in-memory collections with EF Core
4. Add database configuration in appsettings
5. Create and apply migrations

---

**Remember**: This is a demonstration/learning project focused on clean architecture, modern web development practices, and developer experience with .NET Aspire.
