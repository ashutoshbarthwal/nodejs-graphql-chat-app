const { getToken, encryptPassword, comparePassword } = require("@utils")
const db = require('@database');

const {
    AuthenticationError,
} = require('apollo-server');

const groupResolvers = {
    Query:{
        messages: async (parent, args, context, info) => {
            if (context.loggedIn) {
                const group = await db.getCollection('group').findOne({groupName:args.groupName})
                if(group){
                    const member = group.member.indexOf(context.user.username)
                    if(member == -1){
                        return []
                    }else{
                        const messages = group.message
                        console.log(messages)
                        return messages
                    }
                }
            } else {
                throw new AuthenticationError("Authentication required!")
            }
        }
    },
    Mutation: {
        joinGroup: async (parent, args, context, info) => {
            if (context.loggedIn) {
                const newGroup = { groupName : args.groupName , memberID : args.memberID || context.user.username}
                const group = await db.getCollection('group').findOne({groupName:newGroup.groupName})
                if (group) {
                    const member = group.member.indexOf(newGroup.memberID)
                    if(member != -1){
                        return {...group,status:`${newGroup.memberID} already a member of this group`}
                    }else{
                        (await db.getCollection('group').update(
                            { _id: group._id },
                            { $push: { member: newGroup.memberID ,message: {
                                text : `${newGroup.memberID} joined`,
                                from : context.user.username,
                                timestamp : Date.now(),
                                type : 'notify'
                            }} }
                         ))
                        const updatedGroup = await db.getCollection('group').findOne({groupName:newGroup.groupName})
                        return {...updatedGroup,status:`${newGroup.memberID} joined the group`}
                    }
                }else{
                    const newMessage = {
                        text : `${context.user.username} created ${groupName}`,
                        from : context.user.username,
                        timestamp : Date.now(),
                        type : 'notify'
                    }
                    const group = (await db.getCollection('group').insertOne({groupName:newGroup.groupName,member:[context.user.username],message:[newMessage]})).ops[0]
                    console.log(group)
                    return group
                }
            } else {
                throw new AuthenticationError("Please Login Again!")
            }
        },
        sendMessage: async (parent, args, context, info) => {
            if (context.loggedIn) {
                const {groupName,textMessage} = args
                const newMessage = {
                    text : textMessage,
                    from : context.user.username,
                    timestamp : Date.now(),
                    type : 'text'
                }
                
                (await db.getCollection('group').update(
                    { groupName: groupName },
                    { $push: { message: newMessage } }
                 ))
                return group
            }else{
                throw new AuthenticationError("Please Login Again!")
            }
        },
    }
};

module.exports = {
    groupResolvers,
}
