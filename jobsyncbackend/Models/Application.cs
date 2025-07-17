using System.ComponentModel.DataAnnotations;

namespace JobSyncBackend.Models
{
    public class Application
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public int JobId { get; set; }

        public string Status { get; set; } = "Applied"; // Applied, Reviewing, Interview, Rejected, Accepted
        
        [MaxLength(500)]
        public string? CoverLetter { get; set; }

        [MaxLength(200)]
        public string? ResumeUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Job Job { get; set; } = null!;
    }
}
