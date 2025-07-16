using JobSyncBackend.Data;
using JobSyncBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobSyncBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Jobs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobs([FromQuery] string? search = null)
        {
            IQueryable<Job> query = _context.Jobs
                .Include(j => j.Company);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(j => 
                    j.Title.Contains(search) || 
                    j.Description.Contains(search) || 
                    j.Location.Contains(search) ||
                    j.Company.Name.Contains(search));
            }

            return await query
                .Where(j => j.IsActive)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();
        }

        // GET: api/Jobs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Job>> GetJob(int id)
        {
            var job = await _context.Jobs
                .Include(j => j.Company)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
            {
                return NotFound();
            }

            return job;
        }

        // POST: api/Jobs
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Job>> PostJob(JobDto jobDto)
        {
            var company = await _context.Companies.FindAsync(jobDto.CompanyId);
            if (company == null)
            {
                return BadRequest("Invalid company ID.");
            }

            var job = new Job
            {
                Title = jobDto.Title,
                Description = jobDto.Description,
                Location = jobDto.Location,
                SalaryMin = jobDto.SalaryMin,
                SalaryMax = jobDto.SalaryMax,
                JobType = jobDto.JobType,
                ExperienceLevel = jobDto.ExperienceLevel,
                ApplicationDeadline = jobDto.ApplicationDeadline,
                IsActive = true,
                CompanyId = jobDto.CompanyId
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
        }

        // PUT: api/Jobs/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutJob(int id, JobDto jobDto)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
            {
                return NotFound();
            }

            job.Title = jobDto.Title;
            job.Description = jobDto.Description;
            job.Location = jobDto.Location;
            job.SalaryMin = jobDto.SalaryMin;
            job.SalaryMax = jobDto.SalaryMax;
            job.JobType = jobDto.JobType;
            job.ExperienceLevel = jobDto.ExperienceLevel;
            job.ApplicationDeadline = jobDto.ApplicationDeadline;
            job.UpdatedAt = DateTime.UtcNow;

            _context.Entry(job).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JobExists(id))
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

        // DELETE: api/Jobs/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
            {
                return NotFound();
            }

            // Soft delete
            job.IsActive = false;
            job.UpdatedAt = DateTime.UtcNow;
            _context.Entry(job).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool JobExists(int id)
        {
            return _context.Jobs.Any(e => e.Id == id);
        }
    }

    public class JobDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Location { get; set; }
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string? JobType { get; set; }
        public string? ExperienceLevel { get; set; }
        public DateTime? ApplicationDeadline { get; set; }
        public int CompanyId { get; set; }
    }
}
