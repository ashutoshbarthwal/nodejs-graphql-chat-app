const { authResolvers } = require('./authResolvers');
const { groupResolvers } = require('./groupResolvers');

const resolvers = [authResolvers,groupResolvers];

module.exports = {
  resolvers
};
