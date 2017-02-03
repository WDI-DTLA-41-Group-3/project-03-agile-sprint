const express = require('express')
const router = express.Router();
const request = require('request');
const User = require('../models/user')
require('dotenv').config();

const Handlebars = require('handlebars');

const redirect_uri = 'http://127.0.0.1:3000/authorized';

router.get('/', (req, res, next) => {
  // Handlebars.registerPartial('myFirstPartial', '{{blogFeed}}')
  res.render('index', {title: 'TAJJ Ma BLOG'});
});

// router.get('/', (req, res, next) => {
//   res.render('index', {title: 'tajj mah-blog'});
// });

router.get('/login', (req, res, next) =>{
  const client_id = process.env.GITHUB_CLIENT_ID;
  const redirect_url = 'https://github.com/login/oauth/authorize';
  const state = 'JJAT';
  const queryParams = `?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}`;
    res.redirect(redirect_url + queryParams);
});

router.get('/authorized', (req, res, next) =>{
  const code = req.query.code;
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;
  const state = req.query.state;

  const json = {
    code: code,
    client_id: client_id,
    client_secret: client_secret,
    redirect_uri: redirect_uri,
    state: state
  }

  const options = {
    method: 'POST',
    url: 'https://github.com/login/oauth/access_token',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Awesome-Octocat-App'
    },
    json: json
  }
  request(options, (err, response, body) =>{
    if(!err && response.statusCode === 200){
      req.session.access_token = body.access_token;
      const options = {
        method: 'GET',
        url: `https://api.github.com/user?access_token=${body.access_token}`,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Awesome-Octocat-App'
        }
      }
      request(options, (err, response, body) => {
        var gitInfo = JSON.parse(body);
        req.session.userName = gitInfo.login;
        req.session.avatar = gitInfo.avatar_url;
        var user = new User({
          Id: gitInfo.login,
          avatar: gitInfo.avatar_url
        })
        user.save( (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        })
        res.redirect('/active');
      });
    } else {
        console.log('I am the error: ' + err);
        res.json(body);
      }
  });
});

router.get('/active', (req, res, next) => {
  var allBlogs = [];
  User.find({}, (err, users) => {
      users.forEach(function (user) {
        user.blogs.forEach(function (blog) {
        blog.userId = user.Id;
        allBlogs.push(blog);
        })
      })
    console.log(allBlogs);
    })
  res.render('active', {blogs: allBlogs});
});

router.get('/profile', (req, res, next) => {
  res.render('active');
});

router.post('/blog', function (req, res, next) {
  var allBlogs = [];
  var content = req.body.content // Blog Text Entry
  var userId = req.session.userName; // Github username
  var avatar = req.session.avatar;
  var title = req.body.title;
  var blog_id = Date.now()
  User.findOne({ Id: userId }, (err, user) => {
    user.blogs.push({
      title: title,
      content: content,
      blog_id: blog_id
    })
  user.save( (err, data) => {
    User.find({}, (err, users) => {
      users.forEach(function (user) {
        user.blogs.forEach(function (blog) {
        blog.userId = user.Id;
        allBlogs.push(blog);
        })
      })
    console.log(allBlogs);
    })
  res.render('active', {blogs: allBlogs})
  })
});
  // res.render('active', {title: title, content: content, userId: userId, blog_id: blog_id})
});

router.get('/user/:id', function(req,res,next) {
  var userId = req.params.id;
  User.findOne({Id: userId}, (err, user) => {
    var posts = user.blogs
    res.render('profile', {posts: posts})
  });
});

router.get('/blog/:id', function(req, res, next) {
  var blog_id = req.params.id;
  User.findOne({'blogs.blog_id': blog_id}, function (err, user) {
    var user = user.id
    var allBlogs = user.blogs;
    allBlogs.forEach(function(b) {
      if (b.blog_id === blog_id) {
        res.render('blogpage', {post: b.content, user: user})
      }
    });
  });
});

module.exports = router;
