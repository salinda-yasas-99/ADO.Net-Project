using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class UpdateDepartmentDto
{
    [Required(ErrorMessage = "Department code is required.")]
    [StringLength(20, MinimumLength = 1, ErrorMessage = "Department code must be between 1 and 20 characters.")]
    public string DepartmentCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "Department name is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Department name must be between 1 and 100 characters.")]
    public string DepartmentName { get; set; } = string.Empty;
}
