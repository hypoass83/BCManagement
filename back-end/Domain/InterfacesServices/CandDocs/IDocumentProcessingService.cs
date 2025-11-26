using Domain.DTO.CandDocs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.InterfacesServices.CandDocs
{
    public interface IDocumentProcessingService
    {
        Task<List<CandidateDocumentDTO>> ProcessBatchAsync(UploadBatchRequestDTO request);
    }
}
