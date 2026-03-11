# Employee Management System

A full-stack web application for managing employees and departments, built with ASP.NET Core Web API and React.

## Tech Stack

### Backend
- **Framework:** ASP.NET Core Web API (.NET 10.0)
- **Data Access:** ADO.NET with Microsoft.Data.SqlClient
- **Database:** SQL Server with stored procedures
- **Documentation:** Swagger/OpenAPI
- **Architecture:** Repository pattern with dependency injection

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** TailwindCSS 4
- **Routing:** React Router 7
- **HTTP Client:** Axios

## Project Structure

```
├── Backend/
│   └── Backend/
│       ├── Controllers/         # API endpoints
│       ├── Database/            # SQL scripts and stored procedures
│       ├── DTOs/                # Data Transfer Objects
│       ├── Interfaces/          # Repository interfaces
│       ├── Models/              # Entity models
│       ├── Repositories/        # Data access layer
│       └── Program.cs           # Application entry point
│
└── Frontend/
    └── src/
        ├── components/
        │   ├── common/          # Reusable UI components
        │   ├── departments/     # Department-specific components
        │   └── users/           # User-specific components
        ├── pages/               # Page components
        └── services/            # API service layer
```

## Features

### User Management
- Create, read, update, and delete users
- User fields: First Name, Last Name, Email, Date of Birth, Salary, Department
- Auto-calculated age based on date of birth
- Email validation and uniqueness constraint

### Department Management
- Create, read, update, and delete departments
- Department fields: Code, Name
- Unique department code constraint
- Soft delete support

## Getting Started

### Prerequisites
- [.NET 10.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) package manager
- [SQL Server](https://www.microsoft.com/sql-server) (Express or higher)

### Database Setup

1. Create a new database named `AssessmentDB` in SQL Server
2. Run the database script to create tables and stored procedures:
   ```sql
   -- Execute the script located at:
   Backend/Backend/Database/DatabaseScript.sql
   ```
3. Update the connection string in `Backend/Backend/appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=YOUR_SERVER;Database=AssessmentDB;Trusted_Connection=True;TrustServerCertificate=True;"
     }
   }
   ```

### Running the Backend

```bash
cd Backend/Backend
dotnet restore
dotnet run
```

The API will be available at:
- **HTTPS:** https://localhost:7225
- **Swagger UI:** https://localhost:7225/swagger

### Running the Frontend

```bash
cd Frontend
pnpm install
pnpm dev
```

The frontend will be available at http://localhost:5173

## API Endpoints

### Departments

| Method | Endpoint               | Description            |
|--------|------------------------|------------------------|
| GET    | `/api/departments`     | Get all departments    |
| GET    | `/api/departments/{id}`| Get department by ID   |
| POST   | `/api/departments`     | Create new department  |
| PUT    | `/api/departments/{id}`| Update department      |
| DELETE | `/api/departments/{id}`| Delete department      |

### Users

| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| GET    | `/api/users`      | Get all users     |
| GET    | `/api/users/{id}` | Get user by ID    |
| POST   | `/api/users`      | Create new user   |
| PUT    | `/api/users/{id}` | Update user       |
| DELETE | `/api/users/{id}` | Delete user       |

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { },
  "errors": []
}
```

## Development

### Backend Development
- Swagger documentation available at `/swagger` in development mode
- CORS is configured to allow requests from `localhost:3000` and `localhost:5173`

### Frontend Development
- Hot module replacement enabled via Vite
- ESLint configured for code quality
- TailwindCSS for utility-first styling

## License

This project is for assessment purposes.
