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
    public class ArtistWorksController : ControllerBase
    {
        private readonly GalleryAPIContext _context;

        public ArtistWorksController(GalleryAPIContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<object>> CreateArtistWork([FromBody] ArtistWork newArtistWork)
        {
            var work = await _context.Works.FindAsync(newArtistWork.WorkId);
            if (work == null)
            {
                return BadRequest("Invalid WorkId");
            }

            var artist = await _context.Artists.FindAsync(newArtistWork.ArtistId);
            if (artist == null)
            {
                return BadRequest("Invalid ArtistId");
            }

            _context.ArtistWorks.Add(newArtistWork);
            await _context.SaveChangesAsync();

            return Ok(newArtistWork);
        }

        // GET: api/ArtistWorks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArtistWork>>> GetArtistWorks()
        {
            return await _context.ArtistWorks.Include(aw => aw.Artist).Include(aw => aw.Work).ToListAsync();
        }

        // GET: api/ArtistWorks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ArtistWork>> GetArtistWork(int id)
        {
            var artistWork = await _context.ArtistWorks
                .Include(aw => aw.Artist)
                .Include(aw => aw.Work)
                .FirstOrDefaultAsync(aw => aw.Id == id);

            if (artistWork == null)
            {
                return NotFound();
            }

            return artistWork;
        }

        // POST: api/ArtistWorks
        [HttpPost]
        public async Task<ActionResult<ArtistWork>> PostArtistWork(ArtistWork artistWork)
        {
            _context.ArtistWorks.Add(artistWork);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetArtistWork), new { id = artistWork.Id }, artistWork);
        }

        // PUT: api/ArtistWorks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutArtistWork(int id, ArtistWork artistWork)
        {
            if (id != artistWork.Id)
            {
                return BadRequest();
            }

            _context.Entry(artistWork).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArtistWorkExists(id))
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

        // DELETE: api/ArtistWorks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArtistWork(int id)
        {
            var artistWork = await _context.ArtistWorks.FindAsync(id);
            if (artistWork == null)
            {
                return NotFound();
            }

            _context.ArtistWorks.Remove(artistWork);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ArtistWorkExists(int id)
        {
            return _context.ArtistWorks.Any(e => e.Id == id);
        }

        // GET: api/ArtistWorks/ByArtist/5
        [HttpGet("ByArtist/{artistId}")]
        public async Task<ActionResult<IEnumerable<ArtistWork>>> GetArtistWorksByArtist(int artistId)
        {
            return await _context.ArtistWorks
                                 .Include(aw => aw.Artist)
                                 .Include(aw => aw.Work)
                                 .Where(aw => aw.ArtistId == artistId)
                                 .ToListAsync();
        }
    }
}
