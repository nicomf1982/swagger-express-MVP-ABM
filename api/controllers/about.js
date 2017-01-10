
'use strict';

function about(req, res) {
  const name = req.swagger.params.name.value || 'stranger';
  res.json({ version: '1.0.0', name: name });
}

module.exports = about;
