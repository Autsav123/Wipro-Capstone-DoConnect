using Microsoft.AspNetCore.Mvc;
using DoConnect.Models;
using DoConnect.Data;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
namespace DoConnect.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserApiController(AppDbContext context)
        {
            _context = context;
        }


       // [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }

        //[Authorize]
        [HttpGet("{id}")]
        public IActionResult GetUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        // PUT: Update user by ID (user or admin)
        [Authorize]
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] User newUser)
        {
            try
            {
                var user = _context.Users.Find(id);
                if (user == null) return NotFound();

                user.Username = newUser.Username;
                user.Password = newUser.Password; // Real prod app: password update alag karo!
                user.Role = newUser.Role;

                _context.SaveChanges();
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error" + ex.Message);
            }
        }
        //POST: /api/UserApi/login
        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] LoginModel model)
        {
           var user=_context.Users.FirstOrDefault(u => u.Username == model.Username && u.Password == model.Password);
            if (user == null) return Unauthorized();
            var claims = new[]{
new Claim(ClaimTypes.Name,user.Username),
new Claim(ClaimTypes.Role,user.Role??"student")
};
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ThisIsMyUltraSuperStrongJWTKey_2025@#321!"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
               
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);
            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),role=user.Role,userId=user.UserId
            });
           
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterModel model)
        { try
            {
                if (_context.Users.Any(u => u.Username == model.Username))
                {
                    return BadRequest("Username already exists");
                }

                var user = new User
                {
                    Username = model.Username,
                    Password = model.Password,
                    Role = model.Role ?? "student"
                };
                _context.Users.Add(user);
                _context.SaveChanges();
                return Ok(new
                {
                    message = "User registered successfully",
                    userId = user.UserId
                });
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
                var user = _context.Users.Find(id);
                if (user == null) return NotFound();
                _context.Users.Remove(user);
                _context.SaveChanges();
                return Ok(new { message = "User deleted" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error" + ex.Message);
            }
        }
    }
}