const express = require('express')
const router = express.Router();
const request = require('request');

router.get('/', (req, res, next) => {
  res.render('index', {title: 'TAJJ BLOG'});
});

router.get('/login', (req, res, next) =>{

});

router.get('/authorized', (req, res, next) =>{

})


module.exports = router
