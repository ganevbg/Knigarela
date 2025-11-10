namespace Knigarela.Core.Entities.Speedy
{
    public class SpeedyWorkingTimeSchedule
    {
        public DateTime Date { get; set; }

        public string WorkingTimeFrom { get; set; }

        public string WorkingTimeTo { get; set; }

        public string SameDayDepartureCutoff { get; set; }

        public bool StandardSchedule { get; set; }
    }
}
