namespace GalleryAPIWebApp.Models
{
    public class Artist
    {
        public Artist()
        {
            ArtistWorks = new List<ArtistWork>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public virtual ICollection<ArtistWork> ArtistWorks { get; set; }
    }
}
