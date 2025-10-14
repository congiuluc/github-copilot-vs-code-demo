var builder = DistributedApplication.CreateBuilder(args);

// Add the backend API
var api = builder.AddProject<Projects.TodoApi>("todoapi")
    .WithExternalHttpEndpoints();


// Add the frontend (Node.js/Vite app)
var frontend = builder.AddNpmApp("frontend", "../frontend", "dev")
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .WithEnvironment("VITE_API_URL", api.GetEndpoint("http"));

// Reference the API from frontend
frontend.WithReference(api);

builder.Build().Run();
