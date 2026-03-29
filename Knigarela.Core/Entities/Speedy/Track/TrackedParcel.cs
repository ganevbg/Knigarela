using Speedy.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Knigarela.Core.Entities.Speedy.Track
{
    public class TrackedParcel
    {
        public string ParcelId { get; set; }

        public TrackedParcelOperation[] Operations { get; set; }

        public SpeedyError? Error { get; set; }
    }
}
