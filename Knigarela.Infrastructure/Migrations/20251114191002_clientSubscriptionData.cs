using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Knigarela.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class clientSubscriptionData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SubscriptionCancellationCount",
                table: "Clients",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubscriptionDate",
                table: "Clients",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubscriptionCancellationCount",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "SubscriptionDate",
                table: "Clients");
        }
    }
}
