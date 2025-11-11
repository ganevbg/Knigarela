using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Knigarela.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class changestomodels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DeliveryAmount",
                table: "Orders",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeliveryAmount",
                table: "Orders");
        }
    }
}
