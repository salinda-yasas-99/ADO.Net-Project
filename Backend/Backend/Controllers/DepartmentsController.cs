using Backend.DTOs;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly ILogger<DepartmentsController> _logger;

    public DepartmentsController(IDepartmentRepository departmentRepository, ILogger<DepartmentsController> logger)
    {
        _departmentRepository = departmentRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<Department>>>> GetAll()
    {
        try
        {
            var departments = await _departmentRepository.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<Department>>.SuccessResponse(departments, "Departments retrieved successfully."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving departments.");
            return StatusCode(500, ApiResponse<IEnumerable<Department>>.FailResponse("An error occurred while retrieving departments."));
        }
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<Department>>> GetById(int id)
    {
        try
        {
            var department = await _departmentRepository.GetByIdAsync(id);
            if (department == null)
            {
                return NotFound(ApiResponse<Department>.FailResponse("Department not found."));
            }
            return Ok(ApiResponse<Department>.SuccessResponse(department, "Department retrieved successfully."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving department with Id {Id}.", id);
            return StatusCode(500, ApiResponse<Department>.FailResponse("An error occurred while retrieving the department."));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<Department>>> Create([FromBody] CreateDepartmentDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ApiResponse<Department>.FailResponse("Validation failed.", errors));
        }

        try
        {
            var department = new Department
            {
                DepartmentCode = dto.DepartmentCode.Trim(),
                DepartmentName = dto.DepartmentName.Trim()
            };

            var id = await _departmentRepository.CreateAsync(department);
            department.Id = id;

            var created = await _departmentRepository.GetByIdAsync(id);
            return CreatedAtAction(nameof(GetById), new { id }, ApiResponse<Department>.SuccessResponse(created!, "Department created successfully."));
        }
        catch (SqlException ex) when (ex.Number == 50000 || ex.Class == 16)
        {
            return Conflict(ApiResponse<Department>.FailResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating department.");
            return StatusCode(500, ApiResponse<Department>.FailResponse("An error occurred while creating the department."));
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<Department>>> Update(int id, [FromBody] UpdateDepartmentDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ApiResponse<Department>.FailResponse("Validation failed.", errors));
        }

        try
        {
            var existing = await _departmentRepository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound(ApiResponse<Department>.FailResponse("Department not found."));
            }

            var department = new Department
            {
                Id = id,
                DepartmentCode = dto.DepartmentCode.Trim(),
                DepartmentName = dto.DepartmentName.Trim()
            };

            var updated = await _departmentRepository.UpdateAsync(department);
            if (!updated)
            {
                return StatusCode(500, ApiResponse<Department>.FailResponse("Failed to update department."));
            }

            var result = await _departmentRepository.GetByIdAsync(id);
            return Ok(ApiResponse<Department>.SuccessResponse(result!, "Department updated successfully."));
        }
        catch (SqlException ex) when (ex.Number == 50000 || ex.Class == 16)
        {
            return Conflict(ApiResponse<Department>.FailResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating department with Id {Id}.", id);
            return StatusCode(500, ApiResponse<Department>.FailResponse("An error occurred while updating the department."));
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        try
        {
            var existing = await _departmentRepository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound(ApiResponse<object>.FailResponse("Department not found."));
            }

            var deleted = await _departmentRepository.DeleteAsync(id);
            if (!deleted)
            {
                return StatusCode(500, ApiResponse<object>.FailResponse("Failed to delete department."));
            }

            return Ok(ApiResponse<object>.SuccessResponse(null!, "Department deleted successfully."));
        }
        catch (SqlException ex) when (ex.Number == 50000 || ex.Class == 16)
        {
            return Conflict(ApiResponse<object>.FailResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting department with Id {Id}.", id);
            return StatusCode(500, ApiResponse<object>.FailResponse("An error occurred while deleting the department."));
        }
    }
}
