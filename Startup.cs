using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using final.Models;
using Microsoft.EntityFrameworkCore;

namespace final
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // CORS permission
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";


        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Cors permission
            services.AddCors(options =>
            {
                options.AddPolicy(MyAllowSpecificOrigins,
                builder =>
                {
                    builder.WithOrigins("http://127.0.0.1:5500",
                                        "https://localhost:5001");
                });
            });
            
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });


            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

			var connection = "Data Source=budgetapp.db";
			services.AddDbContext<BudgetContext>
				(options => options.UseSqlite(connection));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            // CORS permission
            app.UseCors(MyAllowSpecificOrigins); 

            // app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseMvc(routes => {
				routes.MapRoute("default", "{controller}/{action}");
				// Login screen
				routes.MapRoute("login", "/login", defaults: new {
					controller = "page", action = "login"
				});
				//Sign up screen
				routes.MapRoute("signup", "/signup", defaults: new {
					controller = "page", action = "signup"
				});
				// Main 'budget' screen
				routes.MapRoute("budget", "/budget", defaults: new {
					controller = "page", action="budget"
				});
			});

			app.Run(async (context) => {
				await context.Response.WriteAsync("Startup error.");
			});
        }
    }
}
