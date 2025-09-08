using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DoConnect.Models
{
    public class Answer
    {
        
       [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AnswerId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string ? AnswerText { get; set; }
        public string ?Status { get; set; }

        [Required]
        public int QuestionId { get; set; }
        public Question? Question { get; set; }
        [Required]
        public int UserId { get; set; }
        public User? User { get; set; }
        public ICollection<Image> Images { get; set; } = new List<Image>();
    }
}