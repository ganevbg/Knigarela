using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Knigarela.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class changeOfficeAndSiteIdType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE ""Orders"" 
                SET ""Address_SiteId"" = NULL 
                WHERE ""Address_SiteId"" !~ '^[0-9]+$' OR ""Address_SiteId"" IS NULL;
                
                UPDATE ""Orders""
                SET ""Address_OfficeId"" = NULL
                WHERE ""Address_OfficeId"" !~ '^[0-9]+$' OR ""Address_OfficeId"" IS NULL;

                UPDATE ""ClientAddresses""
                SET ""SiteId"" = NULL
                WHERE ""SiteId"" !~ '^[0-9]+$' OR ""SiteId"" IS NULL;

                UPDATE ""ClientAddresses""
                SET ""OfficeId"" = NULL
                WHERE ""OfficeId"" !~ '^[0-9]+$' OR ""OfficeId"" IS NULL;
            ");

            migrationBuilder.Sql(@"
                ALTER TABLE ""Orders""
                ALTER COLUMN ""Address_SiteId"" TYPE integer
                USING ""Address_SiteId""::integer;

                ALTER TABLE ""Orders""
                ALTER COLUMN ""Address_OfficeId"" TYPE integer
                USING ""Address_OfficeId""::integer;

                ALTER TABLE ""ClientAddresses""
                ALTER COLUMN ""SiteId"" TYPE integer
                USING ""SiteId""::integer;

                ALTER TABLE ""ClientAddresses""
                ALTER COLUMN ""OfficeId"" TYPE integer
                USING ""OfficeId""::integer;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Address_SiteId",
                table: "Orders",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Address_OfficeId",
                table: "Orders",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "SiteId",
                table: "ClientAddresses",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "OfficeId",
                table: "ClientAddresses",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }
    }
}
