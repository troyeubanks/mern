'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Comment = require('./model/comments');

var app = express();
var router = express.Router();

var port = process.env.API_PORT || 3001;

var user = 'TEubanks';
var dbpassword = 'something';
var uri = 'ds139761.mlab.com:39761';
var database = 'teubanks-mern-tutorial';

mongoose.connect(`mongodb://${user}:${dbpassword}@${uri}/${database}`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Allow CORS with middleware to prevent errors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  // removes caching
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Sets route path and initializes API
router.get('/', (req, res) => {
  res.json({ message: 'API Initialized!' });
});

router.route('/comments').get((req, res) => {
  Comment.find((err, comments) => {
    if (err) res.send(err);
    res.json(comments);
  });
}).post((req, res) => {
  var comment = new Comment();
  comment.author = req.body.author;
  comment.text = req.body.text;

  comment.save((err) => {
    if (err) res.send(err);
    res.json({ message: 'Comment successfully loaded!' });
  });
});

router.route('/comments/:comment_id').put((req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) res.send(err);
    (req.body.author) ? comment.author = req.body.author : null;
    req.body.text ? comment.text = req.body.text : null;

    comment.save((err) => {
      if (err) res.send(err);
      res.json({ message: `Comment ${req.params.comment_id} has been updated` });
    });
  });
}).delete((req, res) => {
  Comment.remove({ _id: req.params.comment_id }, (err, comment) => {
    if (err) res.send(err);
    res.json({ message: `Comment ${req.params.comment_id} removed successfully`});
  });
});


// Use our router configuration when we call /api
app.use('/api', router);

app.listen(port, () => {
  console.log(`api running on port ${port}`);
});
