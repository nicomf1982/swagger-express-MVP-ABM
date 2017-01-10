'use strict';

function User(main) {
  const db = main.db;

  return {

    search: (query) => {
      const q = !query ? {} : ('_id' in JSON.parse(query) ? db.ObjectId(JSON.parse(query)._id) : JSON.parse(query));

      return new Promise((resolve, reject) => {
        // try-catch
        db.users.find(q, (err, docs) => {
          err ? reject(err) : resolve(docs);
        });
      });
    },

    create: (userData) => {
      return new Promise((resolve, reject) => {
        db.users.insert(userData, (err, docs) => {
          err ? reject(err) : resolve(docs);
        })
      });
    },

    modify: (id, userData) => {
      const _id = {
        _id: db.ObjectId((JSON.parse(id))._id),
      };

      return new Promise((resolve, reject) => {
        db.users.findAndModify({
          query: _id,
          update: { $set: userData },
          new: true
        }, (err, doc, lastErrorObject) => {
            err ? reject(err) : resolve(doc)
        });
      });
    },

    delete: (id) => {
      const _id = {
        _id: db.ObjectId((JSON.parse(id))._id),
      };

      return new Promise((resolve, reject) => {
        db.users.remove(_id, (err, docs) => {
          err ? reject(err) : resolve(docs);
        });
      });
    },
  };
}

module.exports = User;
