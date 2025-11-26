using Domain.Entities.Configurations;
using Domain.Entities.Security;
using System.Collections.Generic;

namespace Domain.InterfacesStores.Security
{
    public interface IJobStore 
    {
        public Job? CreateJob(Job job);
        public Job? GetJobById(int id);
        public IEnumerable<Job>? GetAllJobs();
        public Job? UpdateJob(Job job);
        public bool DeleteJob(int id);
    }
}
