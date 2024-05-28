namespace GalleryAPIWebApp.Models
{
    public class Work
    {
        public Work()
        {
            ArtistWorks = new List<ArtistWork>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public virtual Category? Category { get; set; }
        public virtual ICollection<ArtistWork> ArtistWorks { get; set; }
    }
}
