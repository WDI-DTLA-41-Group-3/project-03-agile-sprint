const express = require('express')
const router = express.Router();
const request = require('request');
const User = require('../models/user')

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
        res.redirect('/active');
      });
    } else {
        console.log('I am the error: ' + err);
        res.json(body);
      }
  });
});

router.get('/active', (req, res, next) => {
  res.render('active', {title: 'TAJJ Ma BLOG'});
});

router.get('/profile', (req, res, next) => {
  res.render('active', {title: 'tajj mah-blog'});
});

router.post('/blog', function (req, res, next) {
  var content = req.body.content // Blog Text Entry
  var userId = req.session.userName; // Github username
  var avatar = req.session.avatar;
  var blog_id = Date.now()
  User.findOne({ Id: userId }, (err, user) => {
    user.blogs.push({
      content: content,
      blog_id: blog_id
    })
  user.save();
  });
  res.render('index', {content: content, userId: userId, blog_id: blog_id})
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

module.exports = router













