namespace GalleryAPIWebApp.Models
{
    public class Category
    {
        public Category()
        {
            Works = new List<Work>();
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public virtual ICollection<Work> Works { get; set; }
    }
}
