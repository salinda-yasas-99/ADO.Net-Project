using Backend.DTOs;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly ILogger<UsersController> _logger;

    public UsersController(
        IUserRepository userRepository,
        IDepartmentRepository departmentRepository,
        ILogger<UsersController> logger)
    {
        _userRepository = userRepository;
        _departmentRepository = departmentRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<User>>>> GetAll()
    {
        try
        {
            var users = await _userRepository.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<User>>.SuccessResponse(users, "Users retrieved successfully."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users.");
            return StatusCode(500, ApiResponse<IEnumerable<User>>.FailResponse("An error occurred while retrieving users."));
        }
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<User>>> GetById(int id)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound(ApiResponse<User>.FailResponse("User not found."));
            }
            return Ok(ApiResponse<User>.SuccessResponse(user, "User retrieved successfully."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user with Id {Id}.", id);
            return StatusCode(500, ApiResponse<User>.FailResponse("An error occurred while retrieving the user."));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<User>>> Create([FromBody] CreateUserDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ApiResponse<User>.FailResponse("Validation failed.", errors));
        }

        // Validate date of birth is in the past
        if (dto.DateOfBirth.Date >= DateTime.Today)
        {
            return BadRequest(ApiResponse<User>.FailResponse("Date of birth must be in the past."));
        }

        try
        {
            // Validate department exists
            var department = await _departmentRepository.GetByIdAsync(dto.DepartmentId);
            if (department == null)
            {
                return BadRequest(ApiResponse<User>.FailResponse("The specified department does not exist."));
            }

            var user = new User
            {
                FirstName = dto.FirstName.Trim(),
                LastName = dto.LastName.Trim(),
                EmailAddress = dto.EmailAddress.Trim().ToLowerInvariant(),
                DateOfBirth = dto.DateOfBirth,
                Salary = dto.Salary,
                DepartmentId = dto.DepartmentId
            };

            var id = await _userRepository.CreateAsync(user);
            var created = await _userRepository.GetByIdAsync(id);

            return CreatedAtAction(nameof(GetById), new { id }, ApiResponse<User>.SuccessResponse(created!, "User created successfully."));
        }
        catch (SqlException ex) when (ex.Number == 50000 || ex.Class == 16)
        {
            return Conflict(ApiResponse<User>.FailResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user.");
            return StatusCode(500, ApiResponse<User>.FailResponse("An error occurred while creating the user."));
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<User>>> Update(int id, [FromBody] UpdateUserDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ApiResponse<User>.FailResponse("Validation failed.", errors));
        }

        if (dto.DateOfBirth.Date >= DateTime.Today)
        {
            return BadRequest(ApiResponse<User>.FailResponse("Date of birth must be in the past."));
        }

        try
        {
            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound(ApiResponse<User>.FailResponse("User not found."));
            }

            var department = await _departmentRepository.GetByIdAsync(dto.DepartmentId);
            if (department == null)
            {
                return BadRequest(ApiResponse<User>.FailResponse("The specified department does not exist."));
            }

            var user = new User
            {
                Id = id,
                FirstName = dto.FirstName.Trim(),
                LastName = dto.LastName.Trim(),
                EmailAddress = dto.EmailAddress.Trim().ToLowerInvariant(),
                DateOfBirth = dto.DateOfBirth,
                Salary = dto.Salary,
                DepartmentId = dto.DepartmentId
            };

            var updated = await _userRepository.UpdateAsync(user);
            if (!updated)
            {
                return StatusCode(500, ApiResponse<User>.FailResponse("Failed to update user."));
            }

            var result = await _userRepository.GetByIdAsync(id);
            return Ok(ApiResponse<User>.SuccessResponse(result!, "User updated successfully."));
        }
        catch (SqlException ex) when (ex.Number == 50000 || ex.Class == 16)
        {
            return Conflict(ApiResponse<User>.FailResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user with Id {Id}.", id);
            return StatusCode(500, ApiResponse<User>.FailResponse("An error occurred while updating the user."));
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        try
        {
            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound(ApiResponse<object>.FailResponse("User not found."));
            }

            var deleted = await _userRepository.DeleteAsync(id);
            if (!deleted)
            {
                return StatusCode(500, ApiResponse<object>.FailResponse("Failed to delete user."));
            }

            return Ok(ApiResponse<object>.SuccessResponse(null!, "User deleted successfully."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user with Id {Id}.", id);
            return StatusCode(500, ApiResponse<object>.FailResponse("An error occurred while deleting the user."));
        }
    }
}
