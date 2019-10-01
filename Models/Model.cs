using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace final.Models
{
	public class BudgetContext : DbContext
	{
		public BudgetContext(DbContextOptions<BudgetContext> options) : base(options) { }
		public DbSet<User> Users { get; set; }
		public DbSet<Account> Accounts { get; set; }
		public DbSet<Expense> Expenses { get; set; }
		public DbSet<Category> Categories { get; set; }
	}

	public class User
	{
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		public string Guid { get; set; }
		[Required]
		public string Email { get; set; }
		[Required]
		public string Password { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
	}

	public class Expense
	{
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		public string Name { get; set; }
		public decimal Amount { get; set; }
		public string UserGuid { get; set; }
		public DateTime Timestamp { get; set; }
		public Category Category { get; set; } // The category ID. See below for that data structure.
		public Account Account { get; set; } // The account number (not the user number... like a debit card, that type of thing).
	}
	public class Account
	{
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		public string UserGuid { get; set; }
		public string Name { get; set; }
		public string AccountNumber { get; set; }
	}

	public class Category
	{
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		public string UserGuid { get; set; }
		public string Name { get; set; }
		public decimal MaxAmount { get; set; }

	}
}