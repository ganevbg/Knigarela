using Speedy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Knigarela.Core.Entities.Speedy.Track
{
    public class TrackResponse
    {
        public TrackedParcel[] Parcels { get; set; }

        public SpeedyError? Error { get; set; }
    }
}
