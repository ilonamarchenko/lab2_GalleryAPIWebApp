using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GalleryAPIWebApp.Models;

namespace GalleryAPIWebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorksController : ControllerBase
    {
        private readonly GalleryAPIContext _context;

        public WorksController(GalleryAPIContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAll()
        {
            var worksWithDetails = await _context.Works
                .Include(w => w.Category)
                .Include(w => w.ArtistWorks)
                    .ThenInclude(aw => aw.Artist)
                .Select(w => new
                {
                    w.Id,
                    w.Title,
                    w.Description,
                    w.CategoryId,
                    Category = w.Category != null ? new { w.Category.Id, w.Category.Name } : null,
                    Artists = w.ArtistWorks.Select(aw => new { aw.Artist.Id, aw.Artist.Name }).ToList()
                })
                .ToListAsync();

            return Ok(worksWithDetails);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetById(int id)
        {
            var work = await _context.Works
                .Include(w => w.Category)
                .Include(w => w.ArtistWorks)
                    .ThenInclude(aw => aw.Artist)
                .FirstOrDefaultAsync(w => w.Id == id);

            if (work == null)
            {
                return NotFound();
            }

            var workWithDetails = new
            {
                work.Id,
                work.Title,
                work.Description,
                work.CategoryId,
                Category = work.Category != null ? new { work.Category.Id, work.Category.Name } : null,
                Artists = work.ArtistWorks.Select(aw => new { aw.Artist.Id, aw.Artist.Name }).ToList()
            };

            return Ok(workWithDetails);
        }

        [HttpPost]
        public async Task<ActionResult<object>> Create([FromBody] Work newWork)
        {
            var category = await _context.Categories.FindAsync(newWork.CategoryId);
            if (category == null)
            {
                return BadRequest("Invalid CategoryId");
            }

            newWork.Category = category;
            _context.Works.Add(newWork);
            await _context.SaveChangesAsync();

            // Додамо перевірку і додавання зв'язків із художниками
            if (newWork.ArtistWorks != null && newWork.ArtistWorks.Count > 0)
            {
                foreach (var artistWork in newWork.ArtistWorks)
                {
                    artistWork.WorkId = newWork.Id;
                    _context.ArtistWorks.Add(artistWork);
                }
                await _context.SaveChangesAsync();
            }

            var createdWork = await _context.Works
                .Include(w => w.Category)
                .Include(w => w.ArtistWorks)
                    .ThenInclude(aw => aw.Artist)
                .Where(w => w.Id == newWork.Id)
                .Select(w => new
                {
                    w.Id,
                    w.Title,
                    w.Description,
                    w.CategoryId,
                    Category = w.Category != null ? new { w.Category.Id, w.Category.Name } : null,
                    Artists = w.ArtistWorks.Select(aw => new { aw.Artist.Id, aw.Artist.Name })
                })
                .FirstOrDefaultAsync();

            return CreatedAtAction(nameof(GetById), new { id = newWork.Id }, createdWork);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] Work updatedWork)
        {
            var work = await _context.Works.FindAsync(id);
            if (work == null)
            {
                return NotFound();
            }

            var category = await _context.Categories.FindAsync(updatedWork.CategoryId);
            if (category == null)
            {
                return BadRequest("Invalid CategoryId");
            }

            work.Title = updatedWork.Title;
            work.Description = updatedWork.Description;
            work.CategoryId = updatedWork.CategoryId;
            work.Category = category;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var work = await _context.Works.FindAsync(id);
            if (work == null)
            {
                return NotFound();
            }
            _context.Works.Remove(work);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("ByCategory/{categoryId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetWorksByCategory(int categoryId)
        {
            var works = await _context.Works
                .Where(w => w.CategoryId == categoryId)
                .Include(w => w.Category)
                .Include(w => w.ArtistWorks)
                    .ThenInclude(aw => aw.Artist)
                .Select(w => new
                {
                    w.Id,
                    w.Title,
                    w.Description,
                    w.CategoryId,
                    Category = w.Category != null ? new { w.Category.Id, w.Category.Name } : null,
                    Artists = w.ArtistWorks.Select(aw => new { aw.Artist.Id, aw.Artist.Name }).ToList()
                })
                .ToListAsync();

            if (!works.Any())
            {
                return NotFound();
            }

            return Ok(works);
        }

        [HttpGet("ByArtist/{artistId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetWorksByArtist(int artistId)
        {
            var works = await _context.Works
                .Include(w => w.Category)
                .Include(w => w.ArtistWorks)
                    .ThenInclude(aw => aw.Artist)
                .Where(w => w.ArtistWorks.Any(aw => aw.ArtistId == artistId))
                .Select(w => new
                {
                    w.Id,
                    w.Title,
                    w.Description,
                    w.CategoryId,
                    Category = w.Category != null ? new { w.Category.Id, w.Category.Name } : null,
                    Artists = w.ArtistWorks.Select(aw => new { aw.Artist.Id, aw.Artist.Name }).ToList()
                })
                .ToListAsync();

            if (!works.Any())
            {
                return NotFound();
            }

            return Ok(works);
        }
    }

}