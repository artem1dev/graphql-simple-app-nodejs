import books from "./books.json" assert { type: "json" };

export const resolvers = {
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
