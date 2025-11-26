using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Domain.Entities.Security;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Stores.Security
{ 
    public class JobStore : IJobStore
    {
        private readonly FsContext _dbContext;

        public JobStore(FsContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Job? CreateJob(Job job)
        {
            _dbContext.Jobs.Add(job);
            _dbContext.SaveChanges();
            _dbContext.Entry(job).State = EntityState.Detached;
            return GetJobById(job.JobID);
        }

        public Job? GetJobById(int jobId)
        {
            return _dbContext.Jobs.FirstOrDefault(u => u.JobID.Equals(jobId));
        }

        public IEnumerable<Job>? GetAllJobs()
        {
            return _dbContext.Jobs.ToList();
        }

        public Job? UpdateJob(Job job)
        {
            var existingJob = _dbContext.Jobs.FirstOrDefault(u => u.JobID == job.JobID);
            if (existingJob == null)
            {
                return null;
            }
            _dbContext.Entry(existingJob).CurrentValues.SetValues(job);
            _dbContext.SaveChanges();
            _dbContext.Entry(job).State = EntityState.Detached;
            return GetJobById(job.JobID);
        }

        public bool DeleteJob(int id)
        {
            var Job = _dbContext.Jobs.FirstOrDefault(u => u.JobID.Equals(id));
            if (Job == null)
            {
                return false;
            }

            _dbContext.Jobs.Remove(Job);
            _dbContext.SaveChanges();
            return true;
        }
    }
}