
'use strict';

function takeControllers(main) {
  const user = require('./users')(main);

  return {
    'server.time_get': require('./server'),
    'about.about_get': require('./about'),
    'users.search_get': user.search,
    'users.insert_post': user.insert,
    'users.deleteUser_delete': user.deleteUser,
    'users.modify_put': user.modify,
  };
}

module.exports = takeControllers;
