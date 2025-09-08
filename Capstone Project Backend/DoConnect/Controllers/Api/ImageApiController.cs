using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoConnect.Models;
using DoConnect.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace DoConnect.Controllers.Api
{
    [ApiController]
    [Route( "api/[controller]")]
    //[Authorize]
    public class ImageApiController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly AppDbContext _context;

        public ImageApiController(AppDbContext context, IWebHostEnvironment env)
        {
            _env = env;
            _context = context;
        }
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage([FromForm] UploadImageRequest request)
        {
            if (request.File == null || request.File.Length == 0) return BadRequest("No file.");

            var uploadsDir = Path.Combine(_env.WebRootPath, "images");
            if (!Directory.Exists(uploadsDir)) Directory.CreateDirectory(uploadsDir);

            string fileName = Guid.NewGuid() + Path.GetExtension(request.File.FileName);
            string filePath = Path.Combine(uploadsDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            var image = new Image
            {
                ImagePath = "/images/" + fileName,
                QuestionId = request.QuestionId
            };
            _context.Images.Add(image);
            await _context.SaveChangesAsync();

            return Ok(new { image.ImageId, image.ImagePath });
        }

        // Optional: GET all images for a question (for display)
        [HttpGet("byquestion/{questionId}")]
        public IActionResult GetImagesForQuestion(int questionId)
        {
            var images = _context.Images.Where(i => i.QuestionId == questionId)
                                       .Select(i => new { i.ImageId, i.ImagePath })
                                       .ToList();
            return Ok(images);
        }
        [HttpGet]
        public IActionResult GetAll() => Ok(_context.Images
       .Include(i => i.Question)
       .Include(i => i.Answer)
       .ToList());
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var image = _context.Images
                .Include(i => i.Question)
                .Include(i => i.Answer)
                .FirstOrDefault(i => i.ImageId == id);
            if (image == null) return NotFound();
            return Ok(image);
        }
        [HttpPost]
        public IActionResult Create([FromBody] Image image)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _context.Images.Add(image);
            _context.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = image.ImageId }, image);
        }
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Image image)
        {
            if (id != image.ImageId) return BadRequest();

            if (!_context.Images.Any(u => u.ImageId == id)) return NotFound();
            _context.Entry(image).State = EntityState.Modified;
            _context.SaveChanges();
            return NoContent();
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var image = _context.Images.Find(id);
            if (image == null) return NotFound();
            _context.Images.Remove(image);
            _context.SaveChanges();
            return NoContent();
        }
    }
}