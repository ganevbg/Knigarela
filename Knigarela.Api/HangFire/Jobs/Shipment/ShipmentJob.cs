using Hangfire;
using Knigarela.Core.Enums;
using Knigarela.Infrastructure.Data;
using Knigarela.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Knigarela.Api.HangFire.Jobs.Shipment
{
    [AutomaticRetry(Attempts = 0)]
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

        public async Task GenerateAsync()
        {
            var orders = await _db.Orders
                .Include(o => o.Client)
                .Include(o => o.Address)
                .Include(o => o.Items)
                .Where(o => o.Status == Core.Enums.OrderStatus.New)
                .ToListAsync();

            foreach (var order in orders)
            {
                //if (order.WaybillNumber != null)
                //    continue; // skip already processed

                try
                {
                    var shipment = await _speedy.CreateShipmentAsync(order);

                    ////order.WaybillNumber = shipment.WaybillNumber;
                    ////order.WaybillPdfUrl = shipment.PdfUrl;
                    ////order.WaybillCreatedOn = DateTime.UtcNow;
                    ////order.Status = OrderStatus.Processing;

                    ////await _db.SaveChangesAsync();
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
