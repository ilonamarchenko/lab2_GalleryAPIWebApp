using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace GalleryAPIWebApp.Models
{
    public class GalleryAPIContext:DbContext
    {
        public virtual DbSet<Artist> Artists { get; set; }
        public virtual DbSet<ArtistWork> ArtistWorks { get; set; }
        public virtual DbSet<Work> Works { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public GalleryAPIContext(DbContextOptions<GalleryAPIContext> options) : base(options)
        {
            Database.EnsureCreated();
        }
    }
}
