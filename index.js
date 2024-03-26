import express from "express";
import { ApolloServer } from "apollo-server-express";
import { startStandaloneServer } from "@apollo/server/standalone";
import "dotenv/config";
import * as fs from "fs";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    bookId: Int
    name: String
    pages: Int    
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books(nameContains: String): [Book]
  }
`;

var books = JSON.parse(fs.readFileSync("books.json"));
console.log(`Books: ${books}`);

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        books: (parent, args, contextValue, info) => {
            const { nameContains } = args;
            if (nameContains) {
                return books.filter(book => book.name.includes(nameContains));
            } else {
                return books;
            }
        },
    },
    Book: {
        name: (parent, args, contextValue, info) => {
            var name = parent.name;
            return `[${name}]`;
        },
    },
};
const app = express();

// Serve static files from the wwwroot directory
app.use(express.static("wwwroot"));
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
