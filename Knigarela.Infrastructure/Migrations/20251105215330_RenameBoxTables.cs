using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Knigarela.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameBoxTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BoxImage_Box_BoxId",
                table: "BoxImage");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BoxImage",
                table: "BoxImage");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Box",
                table: "Box");

            migrationBuilder.RenameTable(
                name: "BoxImage",
                newName: "BoxImages");

            migrationBuilder.RenameTable(
                name: "Box",
                newName: "Boxes");

            migrationBuilder.RenameIndex(
                name: "IX_BoxImage_BoxId",
                table: "BoxImages",
                newName: "IX_BoxImages_BoxId");

            migrationBuilder.RenameIndex(
                name: "IX_Box_Slug",
                table: "Boxes",
                newName: "IX_Boxes_Slug");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BoxImages",
                table: "BoxImages",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Boxes",
                table: "Boxes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BoxImages_Boxes_BoxId",
                table: "BoxImages",
                column: "BoxId",
                principalTable: "Boxes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BoxImages_Boxes_BoxId",
                table: "BoxImages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BoxImages",
                table: "BoxImages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Boxes",
                table: "Boxes");

            migrationBuilder.RenameTable(
                name: "BoxImages",
                newName: "BoxImage");

            migrationBuilder.RenameTable(
                name: "Boxes",
                newName: "Box");

            migrationBuilder.RenameIndex(
                name: "IX_BoxImages_BoxId",
                table: "BoxImage",
                newName: "IX_BoxImage_BoxId");

            migrationBuilder.RenameIndex(
                name: "IX_Boxes_Slug",
                table: "Box",
                newName: "IX_Box_Slug");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BoxImage",
                table: "BoxImage",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Box",
                table: "Box",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BoxImage_Box_BoxId",
                table: "BoxImage",
                column: "BoxId",
                principalTable: "Box",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
