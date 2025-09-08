using Microsoft.AspNetCore.Mvc;

namespace DoConnect.Controllers.Mvc
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}