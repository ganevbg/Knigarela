using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Knigarela.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addedOrderNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateSequence(
                name: "order_number_seq");

            migrationBuilder.AddColumn<long>(
                name: "OrderNumber",
                table: "Orders",
                type: "bigint",
                nullable: false,
                defaultValueSql: "nextval('order_number_seq')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderNumber",
                table: "Orders");

            migrationBuilder.DropSequence(
                name: "order_number_seq");
        }
    }
}
