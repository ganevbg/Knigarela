using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Knigarela.Core.Entities.Speedy.Track
{
    public class TrackedParcelOperation
    {
        public DateTime? DateTime { get; set; }

        public int OperationCode { get; set; }

        public string Description { get; set; }
    }
}
