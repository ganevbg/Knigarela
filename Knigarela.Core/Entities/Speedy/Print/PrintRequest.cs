namespace Speedy.Models
{
    public class PrintRequest
    {
        public string UserName { get; set; }

        public string Password { get; set; }

        public PaperSize paperSize { get; set; }

        public ParcelsArray[] Parcels { get; set; }
    }
    
    public class ParcelsArray
    {
        public CreatedShipmentParcel Parcel { get; set; }
    }
}
