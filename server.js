'use strict'

//first we import our dependencies…
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Comment = require('./model/comments');

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set
//it up, or 3001
var port = process.env.API_PORT || 3001;

//db config
mongoose.connect('mongodb://admin1:admin1@ds053206.mlab.com:53206/androiditya');

//now we should configure the API to use bodyParser and look for
//JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set
//our headers to allow CORS with middleware like so:
app.use( (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
})

// now we can set the route path & initialize the API
router.get('/', (req, res) => {
  res.json({message: 'API Initialized!'});
});

router.route('/comments').get( (req, res) => {
  Comment.find( (err, comments) => {
    if (err) res.send(err);
    res.json(comments);
  })
})
.post( (req, res) => {
  var comment = new Comment();
  comment.author = req.body.author;
  comment.text = req.body.text;

  comment.save( (err) => {
    if (err)
      res.send(err);
    res.json({message: 'Comment successfully added!'})
  })
})

//Use our router configuration when we call /api
app.use('/api', router);

//Add this after our get and post routes
//Adding a route to a specific comment based on the database ID
router.route('/comments/:comment_id').put( (req, res) => {
  Comment.findById( req.params.comment_id, (err, comment) => {
    if (err) res.send(err);
    (req.body.author) ? comment.author = req.body.author : null;
    (req.body.text) ? comment.text = req.body.text : null;

    comment.save( (err) => {
      if (err) res.send(err);
      res.json({ message: 'comment has been updated'})
    })
  })
})

//delete method for removing a comment from our database
.delete( (req, res) => {
  Comment.remove({_id: req.params.comment_id}, (err, comment) => {
    if (err) res.send(err);
    res.json({message: 'comment has been deleted'})
  })
})

//starts the server and listens for requests
app.listen(port, () => {
  console.log(`api running on port ${port}`);
})
