
const { GraphQLScalarType } = require('graphql')
const { AuthenticationError, ForbiddenError } = require('apollo-server-micro')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Kind } = require('graphql/language')
// Hash configuration
const BCRYPT_ROUNDS = 10;

// const hashPassword = async function(password){
//   var hashedPass = await bcrypt.hash(password, BCRYPT_ROUNDS); 
//   return hashedPass;
// }
const usersData = [
  {
    email: "login1@example.com",
    password: bcrypt.hash("password", BCRYPT_ROUNDS).toString(),
    firstname: "Duoc",
    lastname: "Le"
  },
  {
    email: "login2@example.com",
    password: bcrypt.hash("password", BCRYPT_ROUNDS).toString(),
    firstname: "Login1",
    lastname: "Example1"
  },
  {
    email: "login3@example.com",
    password: bcrypt.hash("password", BCRYPT_ROUNDS).toString(),
    firstname: "Duoc",
    lastname: "Le"
  },
  {
    email: "login4@example.com",
    password: bcrypt.hash("password", BCRYPT_ROUNDS).toString(),
    firstname: "Login4",
    lastname: "Example4"
  }
]

// Resolve GraphQL queries, mutations and graph paths
const resolvers = {
  Query: {
    users: async (obj, args, context) => {
      // -> Access data layer and get user data
      return usersData
    },
    currentUser: async (obj, args, context) => {
      var user = {
        email: context.email ? context.email : '',
        name: context.name
        // name: context.name
      }
      //tim nguoi dung theo email
      // email lay tu con text? hay lay tu args?
      // const user = {
      //   email: "login@example.com",
      //   password: "password",
      //   firstname: "Duoc",
      //   lastname: "Le"
      // }
      return user
    },
    loginUser: async (obj, args, context) => {
      const userInDB = [{
        id: 1,
        email: "login11@example.com",
        password: await bcrypt.hash("password", BCRYPT_ROUNDS),
        firstname: "Duoc",
        lastname: "Le"
      },
      {
        id: 2,
        email: "login12@example.com",
        password: await bcrypt.hash("password", BCRYPT_ROUNDS),
        firstname: "Duoccc",
        lastname: "Le"
      },
      {
        id: 3, 
        email: "login22@example.com",
        password: await bcrypt.hash("password", BCRYPT_ROUNDS),
        firstname: "Duoccc",
        lastname: "Le"
      },
      {
        id: 4,
        email: "login23@example.com",
        password: await bcrypt.hash("password", BCRYPT_ROUNDS),
        firstname: "Duoc23",
        lastname: "Le"
      }]
      // const userFind =  usersData.findOne({ email: args.email });
      const userFind = userInDB.find(user => user.email == args.email)
      // const userFind = usersInDB.find(user => user.email === args.email)
      if (userFind) {
        if (await bcrypt.compare(args.password, userFind.password)) {
          const token = jwt.sign({ email: userFind.email, name: (userFind.firstname + ' ' + userFind.lastname) }, "" + process.env.JWT_SECRET, { expiresIn: '7d' })
          return { token: token }
        }
        else {
          // throw new AuthenticationError('Wrong password')
          return "Wrong password";
        }
      } else {
        // throw new AuthenticationError('Email not exist')
        return "Email not exist";

      }
    }
  },
  Mutation: {
    createUser: async (obj, args, context) => {
      // const userToCreate = {
      //   // id: 1,
      //   email: args.email,
      //   password: args.password,
      //   firstname: args.firstname,
      //   lastname: args.lastname
      // }
      const user = usersData.find(user=> user.email == args.email )
      if (user) {
        throw new ForbiddenError('User already exists');
      }
      args.role = args.role ? args.role : 'USER'

      args.password = await bcrypt.hash(args.password, BCRYPT_ROUNDS)
      args.created = new Date()
      args.created_by = context.name || "system"
      var newUser = {email: args.email, 
                    firstname: args.firstname, 
                    lastname: args.lastname, 
                    id: args.id, 
                    role: args.role, 
                    created: args.created, 
                    created_by: args.created_by};
      return newUser;
    },
    updateUser: async (obj, args, context) => {
      const userInDB = [{
        id: 1,
        email: "login11@example.com",
        password: await bcrypt.hash("password", BCRYPT_ROUNDS),
        firstname: "Duoc",
        lastname: "Le"
      },
      {
        id: 2,
        email: "login12@example.com",
        password: await bcrypt.hash("password", BCRYPT_ROUNDS),
        firstname: "Duoccc",
        lastname: "Le"
      },
      {
        id: 3, 
        email: "login22@example.com",
        password: await bcrypt.hash("password", BCRYPT_ROUNDS),
        firstname: "Duoccc",
        lastname: "Le"
      },
      {
        id: 4,
        email: "login23@example.com",
        password: await bcrypt.hash("password", BCRYPT_ROUNDS),
        firstname: "Duoc23",
        lastname: "Le"
      }]
      //tim user.email == context.email
      let email = context.email;
      // nếu email không hợp lệ vs token, set false
      if(!email){
        return {
          success: false,
          message: "email khong hop le voi token da luu"
        }
      }
      const user = userInDB.find(user => user.email == email);
      // nếu người dùng này không có trong db, tức là token này k hợp lệ, không đc sinh ra từ 1 thằng user trong db, mà đc sinh ra từ cái khác...
      if(!user){
        return {
          success: false,
          message: "user khong hop le, vui long dang nhap lai"
        }
      }
      //nếu id truyền vào hàm đổi, khác với id của người dùng trong token, tức là dổi mật khẩu của người khác, sẽ không cho đổi
      if(args.id != user.id){
        return{
          success: false,
          message: "nguoi dung khong dung, vui long dang nhap lai"
        }
      }
      //check mkhau mạnh yếu
      // let password = args.password;
      if (args.password) {
        args.password = await bcrypt.hash(args.password, BCRYPT_ROUNDS)
      }else{
        return{
          success: false,
          message: "Vui long nhap mat khau"
        }
      }

      // updateUser(id, password);
      // args.updated = new Date()
      // args.updated_by = context.name || "system"


      // Hash password if provided
      // if (args.password) {
      //   args.password = await bcrypt.hash(args.password, BCRYPT_ROUNDS)
      // }
      
      // -> Access data layer and update user data
      return {
        success: true,
        message: "Update pass"
      }
    },
    deleteUser: async (obj, args, context) => {
      // -> Access data layer and delete user data
      return {
        success: true
      }
    }
  },
  User: {
    // Hide password hash
    password() {
      return ''
    }
  }
}

module.exports = resolvers