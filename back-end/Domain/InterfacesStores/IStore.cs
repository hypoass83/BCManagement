using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;
using Domain.Models.Security;

namespace Domain.InterfacesStores
{

    public interface IStore<E> where E : class
    {
        IEnumerable<E> FindAll { get; }
        E Update(E obj);
        E Create(E obj);
        E Delete(E obj);
        void Delete(int id);
        E? Update(E updated, int key);
        E? Find(int key);
        IEnumerable<E> CreateAll(IEnumerable<E> tList);
        IEnumerable<E> DeleteAll(IEnumerable<E> tList);

    }

}

