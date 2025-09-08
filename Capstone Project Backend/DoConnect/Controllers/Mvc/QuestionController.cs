using Microsoft.AspNetCore.Mvc;
namespace DoConnect.Controllers.Mvc
{

    public class QuestionController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}