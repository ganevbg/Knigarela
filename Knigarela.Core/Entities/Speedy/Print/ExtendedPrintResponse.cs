
namespace Speedy.Models
{
    public class ExtendedPrintResponse
    {
        public string? Data { get; set; }
        public SpeedyError? Error { get; set; }

        public LabelInfo[] PrintLabelsInfo { get; set; }
    }

    public class LabelInfo
    {
        public string? ParcelId { get; set; }

        public int? HubId { get; set; }

        public int? OfficeId { get; set; }

        public string? OfficeName { get; set; }

        public int? DeadLineDay { get; set; }

        public int? DeadLineMonth { get; set; }

        public int? TourId { get; set; }

        public string? FullBarcode { get; set; }

        public  int? ExportPriority { get; set; }
    }
}
