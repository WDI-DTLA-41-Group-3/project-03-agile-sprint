const express = require('express')
const router = express.Router();
const request = require('request');
const User = require('../models/user')

router.get('/', (req, res, next) => {
  res.render('index', {title: 'TAJJ BLOG'});
});

router.get('/login', (req, res, next) =>{

});

router.get('/authorized', (req, res, next) =>{

})

router.post('/blog', function (req, res, next) {
  var content = 'wet' // Blog Text Entry
  var userId = 'crimclark' // Github username
  User.findOne({ Id: userId }, (err, user) => {
    user.blogs.push({
    content: content
  })
  console.log(user);
  user.save();
  })
  res.render('index', {content: content, userId: userId})
});


router.get('/user/:id', function(req,res,next) {
  var userId = req.params.id;
  User.findOne({Id: userId}, (err, user) => {
    var posts = JSON.parse(user).blogs
    res.render('handlebarsFileName', {posts: posts})
  })
})


module.exports = router













