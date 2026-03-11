using System.Data;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.Data.SqlClient;

namespace Backend.Repositories;

public class UserRepository : IUserRepository
{
    private readonly string _connectionString;

    public UserRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        var users = new List<User>();

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand("sp_GetAllUsers", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            users.Add(MapUser(reader));
        }

        return users;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand("sp_GetUserById", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        command.Parameters.AddWithValue("@Id", id);

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            return MapUser(reader);
        }

        return null;
    }

    public async Task<int> CreateAsync(User user)
    {
        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand("sp_CreateUser", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        command.Parameters.AddWithValue("@FirstName", user.FirstName);
        command.Parameters.AddWithValue("@LastName", user.LastName);
        command.Parameters.AddWithValue("@EmailAddress", user.EmailAddress);
        command.Parameters.AddWithValue("@DateOfBirth", user.DateOfBirth);
        command.Parameters.AddWithValue("@Salary", user.Salary);
        command.Parameters.AddWithValue("@DepartmentId", user.DepartmentId);

        await connection.OpenAsync();
        var result = await command.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    public async Task<bool> UpdateAsync(User user)
    {
        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand("sp_UpdateUser", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        command.Parameters.AddWithValue("@Id", user.Id);
        command.Parameters.AddWithValue("@FirstName", user.FirstName);
        command.Parameters.AddWithValue("@LastName", user.LastName);
        command.Parameters.AddWithValue("@EmailAddress", user.EmailAddress);
        command.Parameters.AddWithValue("@DateOfBirth", user.DateOfBirth);
        command.Parameters.AddWithValue("@Salary", user.Salary);
        command.Parameters.AddWithValue("@DepartmentId", user.DepartmentId);

        await connection.OpenAsync();
        var result = await command.ExecuteScalarAsync();
        return Convert.ToInt32(result) > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand("sp_DeleteUser", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        command.Parameters.AddWithValue("@Id", id);

        await connection.OpenAsync();
        var result = await command.ExecuteScalarAsync();
        return Convert.ToInt32(result) > 0;
    }

    private static User MapUser(SqlDataReader reader)
    {
        return new User
        {
            Id = reader.GetInt32(reader.GetOrdinal("Id")),
            FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
            LastName = reader.GetString(reader.GetOrdinal("LastName")),
            EmailAddress = reader.GetString(reader.GetOrdinal("EmailAddress")),
            DateOfBirth = reader.GetDateTime(reader.GetOrdinal("DateOfBirth")),
            Salary = reader.GetDecimal(reader.GetOrdinal("Salary")),
            DepartmentId = reader.GetInt32(reader.GetOrdinal("DepartmentId")),
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
