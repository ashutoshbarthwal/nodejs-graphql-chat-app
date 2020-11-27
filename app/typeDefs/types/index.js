const { gql } = require("apollo-server");

const userType = gql`
  type User {
    username: String!
    password: String!
    token: String
    groups: [Group]
  }
`

const groupType = gql`
  type Group {
    groupName: String,
    member: [String!],
    status: String,
    message: [Message]
  }
`

const messageType = gql`
  type Message {
    from: String,
    timestamp: String,
    text: String,
    type: String
  }
`

module.exports = {
  userType,
  groupType,
  messageType
};
