namespace GalleryAPIWebApp.Models
{
    public class ArtistWork
    {
        public int Id { get; set; }
        public int ArtistId { get; set; }
        public int WorkId { get; set; }
        public virtual Artist Artist { get; set; }
        public virtual Work Work { get; set; }
    }
}
