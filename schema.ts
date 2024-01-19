export const typeDefs = `#graphql
    type Query {
        getContact(id: String!): Contact!
        getContacts:[Contact!]!
    }

    type Mutation {
        addContact(name: String!, number: String!): Contact!
        deleteContact(id: ID!): Boolean!
        updateContact(id: String!, name: String, number: String): Contact!
    }

    type Contact {
        id: ID!
        name: String,
        number: String,
        country: String,
        datetime: String,
    }
`;