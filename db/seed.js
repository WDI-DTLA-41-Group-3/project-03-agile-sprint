require('./config')
// Require models
const User = require('../models/user')

User
.remove({})
.then( () => {
  return User.create([
    {
      Id: 'crimclark',
      avatar: 'http://placekitten.com/g/200/300',
      blogs: [{content: 'This is my blog'}]
    }
  ]);
})
.then( () => {
  return User.find({})
})
.then( (users) => {
  console.log(`Seeded ${users.length} users`);
})
.then( () => {
  process.exit() // exit the script
});



// User.findOne({ Id: 'crimclark' }, (err, user) => {
//   user.blogs.push({
//     content: 'another blog'
//   })
//   console.log(user);
//   user.save();
// })





