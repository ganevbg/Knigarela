using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Knigarela.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ssdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string[]>(
                name: "ParcelIds",
                table: "Orders",
                type: "text[]",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ParcelIds",
                table: "Orders");
        }
    }
}
