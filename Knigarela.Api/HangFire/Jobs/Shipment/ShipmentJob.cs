using Hangfire;
using Knigarela.Core.Enums;
using Knigarela.Infrastructure.Data;
using Knigarela.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Knigarela.Api.HangFire.Jobs.Shipment
{
    [AutomaticRetry()]
    public class ShipmentJob : IShipmentJob
    {
        private readonly KnigarelaDbContext _db;
        private readonly ISpeedyService _speedy;
        private readonly ILogger<ShipmentJob> logger;

        public ShipmentJob(KnigarelaDbContext db, ISpeedyService speedy, ILogger<ShipmentJob> logger)
        {
            _db = db;
            _speedy = speedy;
            this.logger = logger;
        }

        public async Task GenerateAsync(DateOnly? pickUpDate)
        {
            var orders = await _db.Orders
                .Include(o => o.Client)
                .Include(o => o.Address)
                .Include(o => o.Items)
                .Where(o => o.Status == OrderStatus.New)
                .ToListAsync();

            foreach (var order in orders)
            {
                if (order.SpeedyId != null)
                    continue; // skip already processed

                try
                {
                    var shipment = await _speedy.CreateShipmentAsync(order, pickUpDate);

                    order.SpeedyId = shipment.Id;
                    order.ParcelIds = shipment.Parcels?.Select(x => x.Id).ToArray();
                    order.DeliveryAmount = shipment.Price?.Total;
                    order.Status = OrderStatus.Processing;

                    // TODO - maybe set pickup data, delivery deadline date etc

                    await _db.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex,
                        "Shipment creation failed for order {OrderNumber}. Will retry job.",
                        order.OrderNumber);

                    // IMPORTANT: throw, so Hangfire triggers retry for the whole job
                    throw;
                }
            }
        }
    }

}
