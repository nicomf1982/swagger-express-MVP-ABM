
'use strict';

function server(req, res) {
  const time = Date().toString();
  res.json({ date: time });
}

module.exports = server;
