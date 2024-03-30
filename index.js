import express from "express";
import { ApolloServer } from "apollo-server-express";
import "dotenv/config";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

const app = express();

// Serve static files from the public directory
app.use(express.static("public"));
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Start the server
server.start().then(() => {
    // Apply middleware to Express app
    server.applyMiddleware({ app });

    // Start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Server listening at http://localhost:${PORT}`);
    });
})
