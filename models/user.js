var mongoose = require('mongoose')

// var ExampleSchema = new mongoose.Schema({
//   name: String,
//   createdAt: { type: Date, default: Date.now }
// })

var BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  blog_id: Number
})

var UserSchema = new mongoose.Schema({
  Id: {type: String, unique: true}, //github Id
  avatar: String, //github avatar url
  blogs: [BlogSchema]
})


module.exports = mongoose.model('User', UserSchema)
