using Domain.Models.Security;
using Domain.Entities.Security;
using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Domain.InterfacesServices.Security;
using System.Collections.Generic;
using AutoMapper;

namespace Application.Service
{
    public class JobService : IJobService
    {
        private readonly IJobStore _jobStore;
        private readonly IMapper _mapper;

        public JobService(IJobStore jobStore, IMapper mapper)
        {
            _jobStore = jobStore;
            _mapper = mapper;
        }

        public JobModel? CreateJob(JobModel jobModel)
        {
            var job = _mapper.Map<Job>(jobModel);
            var createdJob = _jobStore.CreateJob(job);
            return createdJob != null ? _mapper.Map<JobModel>(createdJob) : null;
        }

        public JobModel? GetJobById(int jobId)
        {
            var job = _jobStore.GetJobById(jobId);
            return job != null ? _mapper.Map<JobModel>(job) : null;
        }

        public IEnumerable<JobModel>? GetAllJobs()
        {
            var jobs = _jobStore.GetAllJobs();
            return jobs?.Select(job => _mapper.Map<JobModel>(job));
        }

        public JobModel? UpdateJob(JobModel jobModel)
        {
            var job = _mapper.Map<Job>(jobModel);
            var updatedJob = _jobStore.UpdateJob(job);
            return updatedJob != null ? _mapper.Map<JobModel>(updatedJob) : null;
        }

        public bool DeleteJob(int jobId)
        {
            return _jobStore.DeleteJob(jobId);
        }

    }
}
