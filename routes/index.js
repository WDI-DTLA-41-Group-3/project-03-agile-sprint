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
  var content = req.body.content // Blog Text Entry
  var userId = req.session.someUserId // Github username
  var blog_id = Date.now()
  User.findOne({ Id: userId }, (err, user) => {
    user.blogs.push({
      content: content,
      blog_id: blog_id
    })
  user.save();
  })
  res.render('index', {content: content, userId: userId, blog_id: blog_id})
});


router.get('/user/:id', function(req,res,next) {
  var userId = req.params.id;
  User.findOne({Id: userId}, (err, user) => {
    var posts = user.blogs
    res.render('profile', {posts: posts})
  })
})

router.get('/blog/:id', function(req, res, next) {
  var blog_id = req.params.id;
  User.findOne({'blogs.blog_id': blog_id}, function (err, user) {
    var user = user.id
    var allBlogs = user.blogs;
    allBlogs.forEach(function(b) {
      if (b.blog_id === blog_id) {
        res.render('blogpage', {post: b.content, user: user})
      }
    })
  })
})




module.exports = router













