using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.CandDocs
{
    public class DocumentAccessAudit
    {
        public int Id { get; set; }
        public int DocumentId { get; set; }
        public int UserId { get; set; }
        public DateTime AccessedAt { get; set; }
        public string IpAddress { get; set; } = "";
        public string? UserAgent { get; set; }
        public string Action { get; set; } = "View";
    }

}
