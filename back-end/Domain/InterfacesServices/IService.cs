using System.Collections.Generic;

namespace Domain.InterfacesServices
{
    public interface IService<TModel, TEntity>
        where TEntity : class
        where TModel : class
    {
        TModel? Create(TModel model);
        TModel? GetById(int id);
        IEnumerable<TModel>? GetAll();
        TModel? Update(TModel model);
        bool Delete(int id);
    }
}
