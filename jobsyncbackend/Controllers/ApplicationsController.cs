using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobSyncBackend.Data;
using JobSyncBackend.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace JobSyncBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ApplicationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Applications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application>>> GetUserApplications()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            return await _context.Applications
                .Include(a => a.Job)
                    .ThenInclude(j => j.Company)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        // GET: api/Applications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Application>> GetApplication(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var application = await _context.Applications
                .Include(a => a.Job)
                    .ThenInclude(j => j.Company)
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (application == null)
            {
                return NotFound();
            }

            return application;
        }

        // POST: api/Applications
        [HttpPost]
        public async Task<ActionResult<Application>> ApplyForJob(ApplicationDto applicationDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            // Check if job exists
            var job = await _context.Jobs.FindAsync(applicationDto.JobId);
            if (job == null)
            {
                return BadRequest("Job not found.");
            }

            // Check if already applied
            var existingApplication = await _context.Applications
                .FirstOrDefaultAsync(a => a.JobId == applicationDto.JobId && a.UserId == userId);
                
            if (existingApplication != null)
            {
                return BadRequest("You have already applied for this job.");
            }

            var application = new Application
            {
                UserId = userId,
                JobId = applicationDto.JobId,
                CoverLetter = applicationDto.CoverLetter,
                ResumeUrl = applicationDto.ResumeUrl,
                Status = "Applied"
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, application);
        }

        // PUT: api/Applications/5
        [HttpPut("{id}")]
        public async Task<IActionResult> WithdrawApplication(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var application = await _context.Applications
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
                
            if (application == null)
            {
                return NotFound();
            }

            application.Status = "Withdrawn";
            application.UpdatedAt = DateTime.UtcNow;

            _context.Entry(application).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApplicationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool ApplicationExists(int id)
        {
            return _context.Applications.Any(e => e.Id == id);
        }
    }

    public class ApplicationDto
    {
        public int JobId { get; set; }
        public string? CoverLetter { get; set; }
        public string? ResumeUrl { get; set; }
    }
}
