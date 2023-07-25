/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
const User = require("../users/users-model");

async function restricted(req, res, next) { // eslint-disable-line
  if(!req.session || !req.session.user) {
    return res.status(401).json({
      message: "You shall not pass!"
    })
  } else {
    const user = await User.find()
    res.status(200).json(user)
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  const { username } = req.body
  const users = await User.find()
  const user = users.find(user => user.username === username)

  if(user) {
    return res.status(422).json({
      message: "Username taken"
    })
  }
  next()
  
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists(req, res, next) {
  const { username } = req.body

  const user = User.findBy({ username });

  if(!user) {
    return res.status(401).json({
      message: "Invalid credentials"
    })
  }
  next()

}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  const { password } = req.body

  if(!password || password.length < 3) {
    return res.status(422).json({
      message: "Password must be longer than 3 chars"
    })
  }
  next()

}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
};