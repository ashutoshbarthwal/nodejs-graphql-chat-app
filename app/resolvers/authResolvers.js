const { getToken, encryptPassword, comparePassword } = require("@utils")
const db = require('@database');

const {
    AuthenticationError,
} = require('apollo-server');

const authResolvers = {
    Query: {
        profile: async (parent, args, context, info) => {
            if (context.loggedIn) {
                const groups = await db.getCollection('group').find({member:context.user.username},{fields:{groupName:1,_id: 0}}).toArray()
                console.log(groups)
                return {...context.user,groups:groups}
            } else {
                throw new AuthenticationError("Invalid Token!")
            }
        }
    },
    Mutation: {
        register: async (parent, args, context, info) => {
            const newUser = { username: args.username, password: await encryptPassword(args.password) }
            // Check conditions
            const user = await db.getCollection('user').findOne({ username: args.username })
            if (user) {
                throw new AuthenticationError("User Already Exists!")
            }
            try {
                const regUser = (await db.getCollection('user').insertOne(newUser)).ops[0]
                const token = getToken(regUser);
                return { ...regUser, token }
            } catch (e) {
                throw e
            }
        },
        login: async (parent, args, context, info) => {
            const user = await db.getCollection('user').findOne({ username: args.username })
            if(user){
                const isMatch = await comparePassword(args.password, user.password)
                if (isMatch) {
                    const token = getToken(user)
                    return { ...user, token };
                } else {
                    throw new AuthenticationError("Incorrect Password!")
                }
            }else {
                throw new AuthenticationError("Invalid Username!")
            }
           
        },
    }
};

module.exports = {
    authResolvers,
}
