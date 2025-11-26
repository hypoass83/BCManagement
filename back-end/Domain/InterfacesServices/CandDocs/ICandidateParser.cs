using Domain.Entities.CandDocs;
using Domain.Models.CandDocs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.InterfacesServices.CandDocs
{
    public interface ICandidateParser
    {
        CandidateInfo Parse(string text);
    }
}
