var mongoose = require('mongoose')

// var ExampleSchema = new mongoose.Schema({
//   name: String,
//   createdAt: { type: Date, default: Date.now }
// })

var BlogSchema = new mongoose.Schema({
  content: String,
  blog_id: Number
})

var UserSchema = new mongoose.Schema({
  Id: String, //github Id
  avatar: String, //github avatar url
  blogs: [BlogSchema]
})


module.exports = mongoose.model('User', UserSchema)
