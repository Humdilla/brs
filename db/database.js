var loki = require('lokijs');

// Initialize database
var db = new loki('db/loki.json');
db.addCollection('jobs');
db.addCollection('renderOrder')
.addDynamicView('jobs');

module.exports = db;