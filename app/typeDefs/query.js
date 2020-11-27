const { gql } = require("apollo-server");

const query = gql`
  type Query {
    profile: User
    group: Group,
    messages(groupName: String!): [Message]
  }
  type Mutation {
    register(username: String!, password: String!): User
    login(username: String!, password: String!): User
    joinGroup(groupName: String!, memberID: String): Group
    sendMessage(groupName: String!, textMessage: String!): Group
  }
`;

module.exports = {
  query,
};
