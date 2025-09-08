namespace DoConnect.Models
{
    public class Image
    {
        public int ImageId { get; set; }
        public string? ImagePath { get; set; }
        //public string FileName { get; set; }
        //public string UploadedBy { get; set; }
        //public DateTime UploadedOn { get; set; }
        public int? QuestionId { get; set; }
        public Question? Question { get; set; }
        public int? AnswerId { get; set; }
        public Answer? Answer { get; set; }
    }
}