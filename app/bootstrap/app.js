const { ApolloServer } = require('apollo-server');
const { typeDefs } = require("@typeDefs");
const { resolvers } = require("@resolvers");
const { getPayload } = require('@utils');
const db = require('@database');
const config = require('@config');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection : true,
  context: ({ req }) => {

    // Connect to DB
    db.connect(config.database, (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log("Successfully Connected to MongoDB!")
      }
    })

    // get the user token from the headers
    const token = req.headers.authorization || '';
    // try to retrieve a user with the token
    const { payload: user, loggedIn } = getPayload(token);

    // add the user to the context
    return { user, loggedIn };
  },
});

server.listen(process.env.PORT ||  80).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
