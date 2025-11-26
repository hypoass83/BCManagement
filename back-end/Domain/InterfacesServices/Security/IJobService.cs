using Domain.Models;
using Domain.Models.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.InterfacesServices.Security
{
    public interface IJobService
    {
        public JobModel? CreateJob(JobModel JobModel);
        public JobModel? GetJobById(int id);
        public IEnumerable<JobModel>? GetAllJobs();
        public JobModel? UpdateJob(JobModel JobModel);
        public bool DeleteJob(int id);
    }
}
