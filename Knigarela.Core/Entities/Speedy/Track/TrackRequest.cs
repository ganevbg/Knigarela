using Speedy.Models;

namespace Knigarela.Core.Entities.Speedy.Track
{
    public class TrackRequest
    {
        public string UserName { get; set; }

        public string Password { get; set; }

        public bool LastOperationOnly { get; set; }

        public CreatedShipmentParcel[] Parcels { get; set; }
    }
}
