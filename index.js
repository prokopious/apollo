const { ApolloServer, gql } = require("apollo-server")
const RDSAPI = require("./rds-api")

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Person {
    person_id: Int
    ssn: String
    name: String
    ethnicity: String
    donations: [Donation]
    phones: [Phone]
    addresses: [Address]
    }
  
  
    type Donation {
      type: String
      amount: String
      date: String
      memo: String
      donation_id: Int
      person_id: Int
    }
    type Address {
address_id: Int
person_id: Int
the_address: String
address_type: String

    }

    type Phone {
        phone_id: Int
        person_id: Int
        phone: String
        phone_type: String
    }
    type Query {
    people: [Person]
    donations: [Donation]
    addresses: [Address]
    phones: [Phone]
    person(person_id: Int): Person
  }
`

const resolvers = {
  Query: {
    people: async (_, {}, { dataSources }) => {
      return dataSources.RDSAPI.getPeople()
    },
    person: async (_, {person_id}, { dataSources }) => {
      return dataSources.RDSAPI.getPersonById(person_id)
    },
    donations: async (_, {}, { dataSources }) => {
        return dataSources.RDSAPI.getDonations()
      },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      RDSAPI: new RDSAPI(),
    }
  },
})

// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`
    🚀  Server is ready at ${url}
    📭  Query at https://studio.apollographql.com/dev
  `);
});