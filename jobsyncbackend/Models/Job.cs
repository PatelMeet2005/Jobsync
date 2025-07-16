using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobSyncBackend.Models
{
    public class Job
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? Location { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal? SalaryMin { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal? SalaryMax { get; set; }

        [MaxLength(50)]
        public string? JobType { get; set; } // Full-time, Part-time, Contract, etc.

        [MaxLength(50)]
        public string? ExperienceLevel { get; set; } // Entry, Mid, Senior, etc.

        public DateTime? ApplicationDeadline { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Foreign keys
        public int CompanyId { get; set; }

        // Navigation properties
        public virtual Company Company { get; set; } = null!;
        public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}
