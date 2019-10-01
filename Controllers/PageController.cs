using System;
using Microsoft.AspNetCore.Mvc;
public class PageController : Controller
{
	public ActionResult Login() {
		return File("~login.html", "text/html");
	}
	public ActionResult Signup()
	{
		return File("~signup.html", "text/html");
	}
	public ActionResult Budget()
	{
		return File("~index.html", "text/html");
	}
}