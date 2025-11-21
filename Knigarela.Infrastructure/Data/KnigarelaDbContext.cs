using Knigarela.Core.Entities;
using Knigarela.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Knigarela.Infrastructure.Data;

public class KnigarelaDbContext : IdentityDbContext<ApplicationUser>
{
    public KnigarelaDbContext(DbContextOptions<KnigarelaDbContext> options)
        : base(options) { }

    public DbSet<Box> Boxes => Set<Box>();

    public DbSet<BoxImage> BoxImages => Set<BoxImage>();

    public DbSet<Client> Clients { get; set; }

    public DbSet<ClientAddress> ClientAddresses { get; set; }

    public DbSet<Order> Orders { get; set; }

    public DbSet<OrderItem> OrderItems { get; set; }

    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Box>()
            .HasMany(b => b.Images)
            .WithOne(i => i.Box)
            .HasForeignKey(i => i.BoxId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Box>()
            .HasIndex(b => b.Slug)
            .IsUnique();

        builder.Entity<Client>()
            .HasMany(c => c.Addresses)
            .WithOne(a => a.Client)
            .HasForeignKey(a => a.ClientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Client>()
            .HasMany(c => c.Orders)
            .WithOne(o => o.Client)
            .HasForeignKey(o => o.ClientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Order>().OwnsOne(o => o.Address);

        builder.Entity<Order>()
            .HasMany(o => o.Items)
            .WithOne(i => i.Order)
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<OrderItem>()
            .HasOne(i => i.Box)
            .WithMany()
            .HasForeignKey(i => i.BoxId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Client>(e =>
        {
            e.Property(x => x.Id)
                .HasDefaultValueSql("gen_random_uuid()");

            e.Property<string>("fullname_normalized")
                .HasComputedColumnSql(@"lower(""FullName"")", stored: true);

            e.Property<string>("email_normalized")
                .HasComputedColumnSql(@"lower(""Email"")", stored: true);

            e.Property<string>("phone_normalized")
                .HasComputedColumnSql(@"regexp_replace(""Phone"", '\D', '', 'g')", stored: true);

            e.HasIndex("email_normalized", "phone_normalized", "fullname_normalized")
                .HasDatabaseName("ix_clients_match");
        });

        builder.Entity<ClientAddress>()
            .Property(x => x.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Entity<Order>()
            .Property(x => x.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Entity<OrderItem>()
            .Property(x => x.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Entity<Box>()
            .Property(x => x.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Entity<BoxImage>()
            .Property(x => x.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Entity<Box>()
            .Property<uint>("xmin")
            .IsRowVersion();

        builder.HasSequence<long>("order_number_seq")
       .StartsAt(1)
       .IncrementsBy(1);

        builder.Entity<Order>()
            .Property(o => o.OrderNumber)
            .HasDefaultValueSql("nextval('order_number_seq')");
    }
}
