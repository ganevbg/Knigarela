namespace Knigarela.Core.Entities.Speedy
{
    public class SpeedyOffice
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string NameEn { get; set; }

        public int SiteId { get; set; }

        public SpeedyAddress Address { get; set; }

        public string WorkingTimeFrom { get; set; }

        public string WorkingTimeTo { get; set; }

        public string WorkingTimeHalfFrom { get; set; }

        public string WorkingTimeHalfTo { get; set; }

        public string WorkingTimeDayOffFrom { get; set; }

        public string WorkingTimeDayOffTo { get; set; }

        public string SameDayDepartureCutoff { get; set; }

        public string SameDayDepartureCutoffHalf { get; set; }

        public string SameDayDepartureCutoffDayOff { get; set; }

        public SpeedyParcelDimensions MaxParcelDimensions { get; set; }

        public double MaxParcelWeight { get; set; }

        public string Type { get; set; }

        public int? NearbyOfficeId { get; set; }

        public List<SpeedyWorkingTimeSchedule> WorkingTimeSchedule { get; set; }

        public DateTime ValidFrom { get; set; }

        public DateTime ValidTo { get; set; }

        public List<string> CargoTypesAllowed { get; set; }

        public bool PickUpAllowed { get; set; }

        public bool DropOffAllowed { get; set; }

        public bool PalletOffice { get; set; }

        public bool CashPaymentAllowed { get; set; }

        public bool CardPaymentAllowed { get; set; }
    }
}
