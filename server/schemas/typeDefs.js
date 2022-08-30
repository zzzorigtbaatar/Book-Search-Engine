const { gql } = require('apollo-server-express');

const typeDefs = gql`

    input inputBook {
        description: String
        title: String
        bookId: String
        image: String
        link: String
        authors: [String]
      }
    type User {
        _id: ID
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
        bookCount: Int
    }

    type Book {
        _id: ID
        bookId: String!
        authors: [String]
        description: String!
        title: String!
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        getSingleUser: User
        me: User
    }

    type Mutation {
        createUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(input: inputBook!): User
        deleteBook(bookId: String!): User
    }
`;

module.exports = typeDefs;