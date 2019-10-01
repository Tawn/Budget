using Microsoft.EntityFrameworkCore.Migrations;

namespace final.Migrations
{
    public partial class ExpenseWithName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Expenses",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Expenses");
        }
    }
}
