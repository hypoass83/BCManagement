using System.Collections.Generic;
using System.Linq;

using System;
using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using Domain.InterfacesStores;
using Infrastructure.Context;

namespace Infrastructure.Stores
{

    public class Store<E> : IStore<E> where E : class
    {
        public readonly FsContext _dbContext;
        private DbSet<E> _table;
        public Store(FsContext dbContext)
        {
            _dbContext = dbContext;
            _table = _dbContext.Set<E>();
        }


        public E? Find(int key)
        {
            // Returns null if not found
            return _dbContext.Set<E>().Find(key);
        }

        public IEnumerable<E> FindAll
        {
            get
            {
                _table = _dbContext.Set<E>();
                return _table.ToList();
            }
        }



        public E Update(E obj)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));

            // Ensure no tracked entity with the same key remains to avoid tracking conflicts
            var entityType = _dbContext.Model.FindEntityType(typeof(E));
            var primaryKey = entityType?.FindPrimaryKey();
            if (primaryKey != null)
            {
                var localTracked = _dbContext.Set<E>().Local.FirstOrDefault(localEntity =>
                    primaryKey.Properties.All(pkProp =>
                    {
                        var localVal = _dbContext.Entry(localEntity).Property(pkProp.Name).CurrentValue;
                        var newVal = _dbContext.Entry(obj).Property(pkProp.Name).CurrentValue;
                        return Equals(localVal, newVal);
                    }));

                if (localTracked != null)
                {
                    _dbContext.Entry(localTracked).State = EntityState.Detached;
                }
            }

            _table.Attach(obj);
            _dbContext.Entry(obj).State = EntityState.Modified;
            save();
            return obj;
        }





        public E? Update(E updated, int key)
        {
            if (updated == null) throw new ArgumentNullException(nameof(updated));
            E? existing = _dbContext.Set<E>().Find(key);
            if (existing != null)
            {
                _dbContext.Entry(existing).CurrentValues.SetValues(updated);
                save();
                return existing;
            }
            return null;
        }

        public E Create(E obj)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            _table.Add(obj);
            save();
            return obj;
        }

        public IEnumerable<E> CreateAll(IEnumerable<E> tList)
        {
            _dbContext.Set<E>().AddRange(tList);
            _dbContext.SaveChanges();
            return tList;
        }

        public E Delete(E obj)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            _table.Remove(obj);
            save();
            return obj;
        }

        public void Delete(int key)
        {
            var entity = Find(key);
            if (entity == null) throw new KeyNotFoundException($"Entity with key {key} not found.");
            _table.Remove(entity);
            save();
        }

        public IEnumerable<E> DeleteAll(IEnumerable<E> tList)
        {
            foreach (E t in tList)
            {
                this.Delete(t);
            }
            return tList;
        }

        private void save()
        {
            _dbContext.SaveChanges();
        }



    }
}
