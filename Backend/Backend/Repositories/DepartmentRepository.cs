using System.Data;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.Data.SqlClient;

namespace Backend.Repositories;

public class DepartmentRepository : IDepartmentRepository
{
    private readonly string _connectionString;

    public DepartmentRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    }

    public async Task<IEnumerable<Department>> GetAllAsync()
    {
        var departments = new List<Department>();

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand("sp_GetAllDepartments", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            departments.Add(MapDepartment(reader));
        }

        return departments;
    }

    public async Task<Department?> GetByIdAsync(int id)
    {
        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand("sp_GetDepartmentById", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        command.Parameters.AddWithValue("@Id", id);

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            return MapDepartment(reader);
        }

        return null;
    }

    public async Task<int> CreateAsync(Department department)
    {
        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand("sp_CreateDepartment", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        command.Parameters.AddWithValue("@DepartmentCode", department.DepartmentCode);
        command.Parameters.AddWithValue("@DepartmentName", department.DepartmentName);

        await connection.OpenAsync();
        var result = await command.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    public async Task<bool> UpdateAsync(Department department)
    {
        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand("sp_UpdateDepartment", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        command.Parameters.AddWithValue("@Id", department.Id);
        command.Parameters.AddWithValue("@DepartmentCode", department.DepartmentCode);
        command.Parameters.AddWithValue("@DepartmentName", department.DepartmentName);

        await connection.OpenAsync();
        var result = await command.ExecuteScalarAsync();
        return Convert.ToInt32(result) > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand("sp_DeleteDepartment", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        command.Parameters.AddWithValue("@Id", id);

        await connection.OpenAsync();
        var result = await command.ExecuteScalarAsync();
        return Convert.ToInt32(result) > 0;
    }

    private static Department MapDepartment(SqlDataReader reader)
    {
        return new Department
        {
            Id = reader.GetInt32(reader.GetOrdinal("Id")),
            DepartmentCode = reader.GetString(reader.GetOrdinal("DepartmentCode")),
            DepartmentName = reader.GetString(reader.GetOrdinal("DepartmentName")),
            CreatedDate = reader.GetDateTime(reader.GetOrdinal("CreatedDate")),
            ModifiedDate = reader.IsDBNull(reader.GetOrdinal("ModifiedDate"))
                ? null
                : reader.GetDateTime(reader.GetOrdinal("ModifiedDate")),
            IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive"))
        };
    }
}
