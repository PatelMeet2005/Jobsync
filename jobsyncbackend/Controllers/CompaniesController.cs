using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobSyncBackend.Data;
using JobSyncBackend.Models;
using Microsoft.AspNetCore.Authorization;

namespace JobSyncBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CompaniesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Companies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Company>>> GetCompanies()
        {
            return await _context.Companies.ToListAsync();
        }

        // GET: api/Companies/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Company>> GetCompany(int id)
        {
            var company = await _context.Companies.FindAsync(id);

            if (company == null)
            {
                return NotFound();
            }

            return company;
        }

        // GET: api/Companies/5/Jobs
        [HttpGet("{id}/Jobs")]
        public async Task<ActionResult<IEnumerable<Job>>> GetCompanyJobs(int id)
        {
            if (!CompanyExists(id))
            {
                return NotFound();
            }

            return await _context.Jobs
                .Where(j => j.CompanyId == id && j.IsActive)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();
        }

        // POST: api/Companies
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Company>> PostCompany(CompanyDto companyDto)
        {
            var company = new Company
            {
                Name = companyDto.Name,
                Description = companyDto.Description,
                Location = companyDto.Location,
                Website = companyDto.Website,
                LogoUrl = companyDto.LogoUrl
            };

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCompany), new { id = company.Id }, company);
        }

        // PUT: api/Companies/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutCompany(int id, CompanyDto companyDto)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null)
            {
                return NotFound();
            }

            company.Name = companyDto.Name;
            company.Description = companyDto.Description;
            company.Location = companyDto.Location;
            company.Website = companyDto.Website;
            company.LogoUrl = companyDto.LogoUrl;
            company.UpdatedAt = DateTime.UtcNow;

            _context.Entry(company).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CompanyExists(id))
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

        // DELETE: api/Companies/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCompany(int id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null)
            {
                return NotFound();
            }

            // Check if company has any jobs
            var hasJobs = await _context.Jobs.AnyAsync(j => j.CompanyId == id);
            if (hasJobs)
            {
                return BadRequest("Cannot delete company with active jobs.");
            }

            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CompanyExists(int id)
        {
            return _context.Companies.Any(e => e.Id == id);
        }
    }

    public class CompanyDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Location { get; set; }
        public string? Website { get; set; }
        public string? LogoUrl { get; set; }
    }
}
