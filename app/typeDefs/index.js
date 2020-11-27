const { query } = require("./query");
const { userType ,groupType , messageType} = require("@typeDefs/types");

const typeDefs = [query, userType, groupType, messageType];

module.exports = {
  typeDefs,
};
