using AutoMapper;
using Domain.InterfacesStores;
using Domain.InterfacesServices;
using System.Collections.Generic;
using System.Linq;

namespace Application.Service
{
    public class GenericService<TModel, TEntity> : IService<TModel, TEntity>
        where TEntity : class
        where TModel : class
    {
        private readonly IStore<TEntity> _store;
        private readonly IMapper _mapper;

        public GenericService(IStore<TEntity> store, IMapper mapper)
        {
            _store = store;
            _mapper = mapper;
        }

        public TModel? Create(TModel model)
        {
            var entity = _mapper.Map<TEntity>(model);
            var createdEntity = _store.Create(entity);
            return _mapper.Map<TModel>(createdEntity);
        }

        public TModel? GetById(int id)
        {
            var entity = _store.Find(id);
            return entity == null ? null : _mapper.Map<TModel>(entity);
        }

        public IEnumerable<TModel>? GetAll()
        {
            var entities = _store.FindAll;
            return entities.Select(e => _mapper.Map<TModel>(e)).ToList();
        }

        public TModel? Update(TModel model)
        {
            var entity = _mapper.Map<TEntity>(model);
            var updatedEntity = _store.Update(entity);
            return _mapper.Map<TModel>(updatedEntity);
        }

        public bool Delete(int id)
        {
          
                _store.Delete(id);
                return true;
          
        }
    }
}
