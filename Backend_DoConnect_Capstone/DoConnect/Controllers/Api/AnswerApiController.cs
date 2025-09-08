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
    public class AnswerApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnswerApiController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult GetAll() => Ok(_context.Answers
        .Include(a => a.User)
        .Include(a => a.Question)
         .Include(a => a.Images)
         .ToList());
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var answer = _context.Answers
                .Include(a => a.User)
                .Include(a => a.Question)
                .Include(a => a.Images)
                .FirstOrDefault(a => a.AnswerId == id);
            if (answer == null) return NotFound();
            return Ok(answer);
        }
        [HttpPost]
        public IActionResult Create([FromBody] Answer a)
        {
            try
            {
                a.Status = "pending";
                if (!ModelState.IsValid) return BadRequest(ModelState);
                _context.Answers.Add(a);
                _context.SaveChanges();
                return CreatedAtAction(nameof(Get), new { id = a.AnswerId }, a);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error" + ex.Message);
            }
        }
        [HttpPost("add-answer")]
public IActionResult AddAnswer([FromBody] Answer answer)
{
    if (!ModelState.IsValid) return BadRequest(ModelState);
answer.Status = "pending";
    _context.Answers.Add(answer);
    _context.SaveChanges();
    return Ok(answer);
}

[HttpGet("answers-by-question/{questionId}")]
public IActionResult GetAnswersForQuestion(int questionId)
{
    var answers = _context.Answers
        .Where(a => a.QuestionId == questionId)
        .ToList();
    return Ok(answers);
}
[HttpGet("pending")]
    public IActionResult GetPendingAnswers()
    {
        var answers = _context.Answers.Where(a => a.Status == "pending").ToList();
        return Ok(answers);
    }

    // Approve the answer
    [HttpPost("approve/{id}")]
    public IActionResult ApproveAnswer(int id)
    {
        var answer = _context.Answers.Find(id);
        if (answer == null) return NotFound();
        answer.Status = "approved";
        _context.SaveChanges();
        return Ok();
    }

    // Reject the answer
    [HttpPost("reject/{id}")]
    public IActionResult RejectAnswer(int id)
    {
        var answer = _context.Answers.Find(id);
        if (answer == null) return NotFound();
        answer.Status = "rejected";
        _context.SaveChanges();
        return Ok();
    }
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Answer a)
        {
            try{
            if (id != a.AnswerId) return BadRequest();

            if (!_context.Answers.Any(u => u.AnswerId == id)) return NotFound();
            _context.Entry(a).State = EntityState.Modified;
            _context.SaveChanges();
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error" + ex.Message);
        }
    }
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        try
            {
                var answer = _context.Answers.Find(id);
                if (answer == null) return NotFound();
                _context.Answers.Remove(answer);
                _context.SaveChanges();
                return Ok(new { message = "Answer deleted" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error" + ex.Message);
            }
        }
        }
    }
