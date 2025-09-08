using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoConnect.Models;
using DoConnect.Data;
using Microsoft.AspNetCore.Authorization;

namespace DoConnect.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]

    public class QuestionApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuestionApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_context.Questions
        .Include(q => q.User)
        .Include(q => q.Answers)
        .Include(q => q.Images)
        .ToList());
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var question = _context.Questions
                .Include(q => q.User)
                .Include(q => q.Answers)
                .Include(q => q.Images)
                .FirstOrDefault(q => q.QuestionId == id);
            if (question == null) return NotFound();
            return Ok(question);
        }
        [HttpPost]
        public IActionResult Create([FromBody] Question q)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                _context.Questions.Add(q);
                _context.SaveChanges();
                return CreatedAtAction(nameof(Get), new { id = q.QuestionId }, q);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error" + ex.Message);
            }
        }
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Question q)
        {
            try
            {
                if (id != q.QuestionId) return BadRequest();

                if (!_context.Questions.Any(u => u.QuestionId == id)) return NotFound();
                _context.Entry(q).State = EntityState.Modified;
                _context.SaveChanges();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error" + ex.Message);
            }
        }
        //[Authorize(Roles = "Admin")]
        [HttpPost("soft-delete/{id}")]
        
        
        public IActionResult SoftDelete(int id)
        {
            
                var question = _context.Questions.Find(id);
                if (question == null) return NotFound();
                question.Status = "deleted"; 
                
                _context.SaveChanges();
                return Ok(new { message = "Question deleted" });
            
           
        }
        // 1. Get pending questions (status == "pending")
        [HttpGet("pending")]
public IActionResult GetPending()
{
    var pending = _context.Questions
        .Include(q => q.User)
        .Include(q => q.Answers)
        .Include(q => q.Images)
        .Where(q => q.Status == "pending")
        .ToList();
    return Ok(pending);
}

// 2. Get approved questions (status == "approved")
[HttpGet("approved")]
public IActionResult GetApproved()
{
    var approved = _context.Questions
        .Include(q => q.User)
        .Include(q => q.Answers)
        .Include(q => q.Images)
        .Where(q => q.Status == "approved")
        .ToList();
    return Ok(approved);
}

// 3. Get rejected questions (status == "rejected")
[HttpGet("rejected")]
public IActionResult GetRejected()
{
    var rejected = _context.Questions
        .Include(q => q.User)
        .Include(q => q.Answers)
        .Include(q => q.Images)
        .Where(q => q.Status == "rejected")
        .ToList();
    return Ok(rejected);
}
[HttpGet("search")]
public IActionResult SearchQuestions(string query)
{
    if (string.IsNullOrEmpty(query))
        return BadRequest("Query cannot be empty");

    var results = _context.Questions
        .Where(q => q.Status == "approved" && q.QuestionText != null && q.QuestionText.Contains(query))
        .ToList();
    return Ok(results);
}
// 4. Approve a question
[HttpPost("approve/{id}")]
public IActionResult Approve(int id)
{
    var question = _context.Questions.Find(id);
    if (question == null) return NotFound();
    question.Status = "approved";
    _context.SaveChanges();
    return Ok(new { message = "Question approved" });
}

// 5. Reject a question
[HttpPost("reject/{id}")]
public IActionResult Reject(int id)

{
    var question = _context.Questions.Find(id);
    if (question == null) return NotFound();
    question.Status = "rejected";
    _context.SaveChanges();
    return Ok(new { message = "Question rejected" });
}
[HttpPost("add-question")]
public IActionResult AddQuestion([FromBody] Question q)
{
    if (!ModelState.IsValid) return BadRequest(ModelState);

    q.Status = "pending"; 
    _context.Questions.Add(q);
    _context.SaveChanges();
   return Ok(q);
}
// 6. Add Answer (multiple answers)
[HttpPost("add-answer/{questionId}")]
public IActionResult AddAnswer(int questionId, [FromBody] Answer answer)
{
    var question = _context.Questions
        .Include(q => q.Answers)
        .FirstOrDefault(q => q.QuestionId == questionId && q.Status == "approved");
    if (question == null) return NotFound("Approved question not found");

    answer.QuestionId = questionId;
    _context.Answers.Add(answer);
    question.Answers.Add(answer); 
    _context.SaveChanges();
    return Ok(new { message = "Answer added" });
}
        }
    }
