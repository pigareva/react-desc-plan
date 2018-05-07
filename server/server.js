const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./bd/bd');
const app            = express();
app.use(bodyParser.urlencoded({ extended: true }));

const port = 8000;
MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err);
  require('./server/routes')(app, database);
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
});