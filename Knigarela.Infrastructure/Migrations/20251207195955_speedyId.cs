using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Knigarela.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class speedyId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "DeliveryAmount",
                table: "Orders",
                type: "numeric",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AddColumn<string>(
                name: "SpeedyId",
                table: "Orders",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SpeedyId",
                table: "Orders");

            migrationBuilder.AlterColumn<decimal>(
                name: "DeliveryAmount",
                table: "Orders",
                type: "numeric",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "numeric",
                oldNullable: true);
        }
    }
}
