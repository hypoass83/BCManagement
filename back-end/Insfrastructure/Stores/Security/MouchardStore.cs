
using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Domain.Entities.Security;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Stores.Security
{

    public class MouchardStore : IMouchardStore
    {
        private readonly FsContext _dbContext;

        public MouchardStore(FsContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void LogAction(Mouchard mouchard)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    _dbContext.Mouchards.Add(mouchard);
                    _dbContext.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    Console.WriteLine("mouchar operation failed: " + ex.Message);
                }
            }
        }

        public bool InsertOperation(int UserID, string Action, string Description, string ProcedureName, DateTime BusinessDate, int BranchID)
        {
            bool res = false;
            try
            {
                Mouchard MoucharToSave = new Mouchard()
                {
                    UserID = UserID,
                    MoucharAction = Action,
                    MoucharDescription = Description,
                    MoucharOperationType = "INSERT",
                    BranchID = BranchID,
                    SneackHour = DateTime.UtcNow.ToString("HH:mm"),
                    MoucharBusinessDate = BusinessDate,
                    MoucharProcedureName = ProcedureName,
                };
                _dbContext.Mouchards.Add(MoucharToSave);
                _dbContext.SaveChanges();
                res = true;
            }
            catch (Exception e)
            {
                res = false;
                throw new Exception("Error : " + "e.Message = " + e.Message + "e.InnerException = " + e.InnerException + "e.StackTrace = " + e.StackTrace);
            }
            return res;
        }
    }
}