using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Knigarela.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Somechanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address_City",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "Address_Phone",
                table: "Orders",
                newName: "Address_SiteName");

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "Boxes",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "xmin",
                table: "Boxes");

            migrationBuilder.RenameColumn(
                name: "Address_SiteName",
                table: "Orders",
                newName: "Address_Phone");

            migrationBuilder.AddColumn<string>(
                name: "Address_City",
                table: "Orders",
                type: "text",
                nullable: true);
        }
    }
}
