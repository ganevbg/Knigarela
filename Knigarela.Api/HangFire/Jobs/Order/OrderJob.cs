
using Hangfire;
using Knigarela.Services.Interfaces;

namespace Knigarela.Api.HangFire.Jobs.Order
{
    [AutomaticRetry()]

    public class OrderJob : IOrderJob
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<OrderJob> _logger;

        public OrderJob(IOrderService orderService, ILogger<OrderJob> logger)
        {
            _orderService = orderService;
            _logger = logger;
        }

        public async Task GenerateAsync()
        {
            var results = await _orderService.CreateOrdersForSubscribersAsync();

            // If any creation failed, log and throw to allow Hangfire to retry the job
            var failed = results.Where(r => !r.Success).ToList();
            if (failed.Any())
            {
                foreach (var f in failed)
                {
                    _logger.LogError("Failed to create subscription order: {Issues}", f.Issues);
                }

                throw new Exception("One or more subscription orders failed to be created. See logs for details.");
            }
        }
    }
}
