using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.Entities.Security
{
    public class ActionMenuProfile
    {
        public int ActionMenuProfileID { get; set; }
        public bool Delete { get; set; } = true;
        public bool Add { get; set; } = true;
        public bool Update { get; set; } = true;
        public int MenuID { get; set; }

         [JsonIgnore]
        public virtual Menu Menu { get; set; }
        public int ProfileID { get; set; }
        
        [JsonIgnore]
        public virtual Profile Profile { get; set; }
    }
}
