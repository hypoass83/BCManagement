using Xunit;
using Infrastructure.Stores.Security;
using Domain.Entities.Security;
using Tests.UnitTests.Helpers;
using System.Linq;
using Domain.Entities.Configurations;

namespace Tests.UnitTests.Stores
{
    public class JobStoreTests
    {
        private readonly JobStore _store;
        private readonly Infrastructure.Context.FsContext _context;

        public JobStoreTests()
        {
            _context = TestHelper.GetSqliteInMemoryContext();
            _store = new JobStore(_context);
        }



        [Fact]
        public void CreateJob_ShouldAddJobToDatabase()
        {
            // Arrange
            var job = new Job
            {
                JobLabel = "Développeur .NET",
                JobDescription = "Backend Developer",
                JobCode = "DEV001"
            };

            // Act
            var created = _store.CreateJob(job);

            // Assert
            Assert.NotNull(created);
            Assert.Equal("Développeur .NET", created.JobLabel);
        }

        [Fact]
        public void GetJobById_ShouldReturnCorrectJob()
        {
            // Arrange
            var job = new Job { JobLabel = "Manager", JobCode = "MNG001",   JobDescription = "Backend Developer" };
            var created = _store.CreateJob(job);
            Assert.NotNull(created);

            // Act
            var found = _store.GetJobById(created.JobID);

            // Assert
            Assert.NotNull(found);
            Assert.Equal("Manager", found.JobLabel);
        }

        [Fact]
        public void UpdateJob_ShouldModifyExistingJob()
        {
            // Arrange
            var job = new Job { JobLabel = "Analyste", JobCode = "ANA001",  JobDescription = "Backend Developer" };
            var created = _store.CreateJob(job);
            Assert.NotNull(created);

            created.JobLabel = "Analyste Senior";

            // Act
            var updated = _store.UpdateJob(created);

            // Assert
            Assert.NotNull(updated);
            Assert.Equal("Analyste Senior", updated.JobLabel);
        }

        [Fact]
        public void DeleteJob_ShouldRemoveJobFromDatabase()
        {
            // Arrange
            var job = new Job { JobLabel = "Testeur", JobCode = "TST001", JobDescription = "Backend Developer" };
            var initialCount = _context.Jobs.Count();
            var created = _store.CreateJob(job);
            Assert.NotNull(created);

            // Act
            var result = _store.DeleteJob(created.JobID);

            // Assert
            Assert.True(result);
            Assert.Equal(initialCount, _context.Jobs.Count());
        }

        [Fact]
        public void GetAllJobs_ShouldReturnAllJobs()
        {
            // Arrange
            var initialCount = _context.Jobs.Count();
            var job1 = _store.CreateJob(new Job { JobLabel = "J1", JobCode = "C1",  JobDescription = "Backend Developer" });
            var job2 = _store.CreateJob(new Job { JobLabel = "J2", JobCode = "C2",  JobDescription = "Backend Developer" });
            Assert.NotNull(job1);
            Assert.NotNull(job2);

            // Act
            var jobs = _store.GetAllJobs();

            // Assert
            Assert.NotNull(jobs);
            Assert.Equal(initialCount + 2, jobs.Count());
            Assert.Contains(jobs, j => j.JobLabel == "J1" && j.JobCode == "C1");
            Assert.Contains(jobs, j => j.JobLabel == "J2" && j.JobCode == "C2");


        }
    }
}
