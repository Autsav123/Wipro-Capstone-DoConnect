using Microsoft.AspNetCore.Http;

namespace DoConnect.Models
{
    public class UploadImageRequest
    {
        public int QuestionId { get; set; }
        public IFormFile File { get; set; } = null!;
    }
}
