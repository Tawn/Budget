using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using final.Models;

namespace final.Controllers
{
	[Controller]
	public class ApiController : ControllerBase
	{
		private readonly BudgetContext _context;

		public ApiController(BudgetContext ctx)
		{
			_context = ctx;
		}

		// Get all expenses
		[HttpGet("api/expenses/{userGuid}")]
		[HttpGet("api/users/{userGuid}/expenses")]
		public ActionResult<IEnumerable<Expense>> GetAllExpenses(string userGuid)
		{
			var expenses = _context.Expenses.Where(e => e.UserGuid == userGuid).ToList<Expense>();
			return Ok(expenses);
		}

		// Get particular expense by id
		[HttpGet("api/expenses/{expenseID}")]
		public ActionResult<Expense> GetExpense(int expenseID)
		{
			var expenses = _context.Expenses.Where(e => e.Id == expenseID).First();
			return Ok(expenses);
		}

		// Initialize page with all user details
		[HttpGet("api/users/{userGuid}/init")]
		public ActionResult<object> InitUser(string userGuid)
		{
			var ret = new
			{
				UserDetails = _context.Users.Where(u => u.Guid == userGuid).First(),
				Categories = _context.Categories.Where(c => c.UserGuid == userGuid).ToList<Category>(),
				Expenses = _context.Expenses.Where(e => e.UserGuid == userGuid).ToList<Expense>(),
				Accounts = _context.Accounts.Where(a => a.UserGuid == userGuid).ToList<Account>()
			};
			return Ok(ret);
		}

		// Get all categories
		[HttpGet("api/users/{userGuid}/categories")]
		public ActionResult<IEnumerable<Category>> GetAllCategories(string userGuid)
		{
			var cats = _context.Categories.Where(c => c.UserGuid == userGuid).ToList<Category>();
			return Ok(cats);
		}

		// Get all accounts for a user. Make sure to obfuscate the account number string (or show only last 4 digits, for example) on the Front End.
		[HttpGet("api/users/{userGuid}/accounts")]
		public ActionResult<IEnumerable<Account>> GetAllAccounts(string userGuid)
		{
			var accts = _context.Accounts.Where(a => a.UserGuid == userGuid).ToList<Account>();
			return Ok(accts);
		}

		// Post new user.
		[HttpPost("api/users/add")]
		public ActionResult<string> AddExpense([FromBody] User u)
		{
			
			if (!ModelState.IsValid) return BadRequest(u.ToString());
			// Create a new guid.
			Guid g = Guid.NewGuid();
			String guid = g.ToString();

			// Check if that guid is in use (extremely unlikely).
			while (_context.Users.Any(user => user.Guid == guid))
			{
				g = Guid.NewGuid();
				guid = g.ToString();
			}

			// Add to the user object.
			u.Guid = guid;

			_context.Users.Add(u);
			_context.SaveChanges();

			return Ok(u);
		}

		// Post new expense.
		[HttpPost("api/expenses/add")]
		public ActionResult<string> AddExpense([FromBody] Expense e)
		{
			if (!ModelState.IsValid)
				return BadRequest("Bad POST body, no changes made.");

			// Check if account Id is real and if so, grab that account for EF foreign key assignment.
			if (e.Account != null && !String.IsNullOrEmpty(e.Account.Id.ToString()))
			{
				e.Account = _context.Accounts.Where(a => a.Id == e.Account.Id).First();
			}
			else
			{
				e.Account = null;
			}

			// Same for category.
			if (e.Category != null && !String.IsNullOrEmpty(e.Category.Id.ToString()))
			{
				e.Category = _context.Categories.Where(c => c.Id == e.Category.Id).First();
			}
			else
			{
				e.Category = null;
			}

			_context.Expenses.Add(e);
			_context.SaveChanges();

			return Ok("Expense added.");
		}

		// Delete expense
		[HttpDelete("api/expenses/delete")]
		public ActionResult<string> DeleteAccount([FromBody] Expense e)
		{
			if(!ModelState.IsValid)
				return BadRequest("Invalid expense body.");

			Expense toDelete = _context.Expenses.Where(ex => ex.Id == e.Id).First();

			if(toDelete == null)
				return NotFound($"No expense with ID {e.Id} found.");
			
			_context.Expenses.Remove(toDelete);
			_context.SaveChanges();

			return Ok($"Expense with Id {e.Id} deleted.");
		}

		// Post new account.
		[HttpPost("api/accounts/add")]
		public ActionResult<string> AddAccount([FromBody] Account a)
		{
			if (!ModelState.IsValid)
				return BadRequest("Bad POST body, no changes made.");

			_context.Accounts.Add(a);
			_context.SaveChanges();

			return Ok("Account added.");
		}

		// Post new category.
		[HttpPost("api/categories/add")]
		public ActionResult<string> AddCategory([FromBody] Category c)
		{
			if (!ModelState.IsValid)
				return BadRequest("Bad POST body, no changes made.");

			_context.Categories.Add(c);
			_context.SaveChanges();

			return Ok("Category added.");
		}

		// Delete category by Id
		[HttpDelete("api/categories/delete")]
		public ActionResult<string> DeleteCategory([FromBody] Category c)
		{
			if(!ModelState.IsValid)
				return BadRequest("Invalid category body.");

			Category toDelete = _context.Categories.Where(cat => cat.Id == c.Id).First();

			if(toDelete == null)
				return NotFound($"No category with ID {c.Id} found.");
			
			_context.Categories.Remove(toDelete);
			_context.SaveChanges();

			return Ok($"Category with Id {c.Id} deleted.");
		}

		// LOG IN
		[HttpPost("api/login")]
		public ActionResult<object> Login([FromBody] User u)
		{
			object ret = new
			{
				LoginSuccessful = false,
				UserGuid = "null",
				ResponseMsg = "Improper POST body, or incorrect email/password combination."
			};

			List<User> results = _context.Users.Where(user => user.Email == u.Email).Where(user => user.Password == u.Password).ToList();

			if (results.Any())
				return Ok(
					new
					{
						LoginSuccessful = true,
						UserGuid = results[0].Guid
					}
				);
			else
				return BadRequest(
					new
					{
						LoginSuccessful = false,
						UserGuid = ""
					}
				);
		}
	}

}