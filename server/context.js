const { AuthenticationError } = require('apollo-server-micro')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
// const usersData = require('./data/dataStatic')
const usersData = [
  {
      email: "login1@example.com",
      password: bcrypt.hash("password", 5),
      firstname: "Duoc",
      lastname: "Le"
  },
  {
      email: "login2@example.com",
      password: bcrypt.hash("password", 5),
      firstname: "Login1",
      lastname: "Example1"
  },
  {
      email: "login3@example.com",
      password: bcrypt.hash("password", 5),
      firstname: "Duoc",
      lastname: "Le"
  },
  {
      email: "login4@example.com",
      password: bcrypt.hash("password", 5),
      firstname: "Login4",
      lastname: "Example4"
  }
]
const context = ({ req }) => {
  // console.log(req.headers.authorization)
  // Get the user token from the headers
  let token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
  // Verify token if available  

  if (token) {
    try {
      token = jwt.verify(token, ""+process.env.JWT_SECRET);
      //find user from database
      // const user =  usersData.find(user => user.email === token.email );
    } catch (error) {
      throw new AuthenticationError(
        'Authentication token is invalid, please log in.'
      )
    }
  }
  else{
    // throw new AuthenticationError(
    //   'Authentication token is invalid, please log in.'
    // )
    console.log(token);
  }
  return {
    email: token ? token.email : null,
    name: token ? token.name : null
    // name: token ? token.name : null,
  
    // role: user ? user.role : null
  }
} 

module.exports = context