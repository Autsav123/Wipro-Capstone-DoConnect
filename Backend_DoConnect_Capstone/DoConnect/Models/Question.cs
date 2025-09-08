using System.ComponentModel.DataAnnotations;

namespace DoConnect.Models
{
    public class Question
    {
        public int QuestionId { get; set; }

        
        public string? QuestionTitle { get; set; }

        [Required][StringLength(200)]
        public string? QuestionText { get; set; }
        public string? Status { get; set; }
        [Required]
        public int UserId { get; set; }
        public User? User { get; set; }
        public ICollection<Answer> Answers { get; set; } = new List<Answer>();
        public ICollection<Image> Images { get; set; } = new List<Image>();
    }
}