'use strcit';

function users(main) {
  const libs = main.libs;

  return {
    search: (req, res) => {
      const query = req.swagger.params.q.value;
      libs.users.search(query).then((q) => {
        res.json(q);
      });
    },
    insert: (req, res) => {
      const user = req.swagger.params.user.value;
      libs.users.create(user).then((q) => {
        res.json(q);
      });
    },
    deleteUser: (req, res) => {
      const id = req.swagger.params.id.value;
      libs.users.delete(id).then((docs) => {
        res.json(docs);
      });
    },
    modify: (req, res) => {
      const id = req.swagger.params.id.value;
      const user = req.swagger.params.user.value;
      libs.users.modify(id, user).then((userMod) => {
        res.json(userMod);
      });
    },
  };
}

module.exports = users;
