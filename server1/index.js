const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  type Music{
    title: String
    author: String
  }
  type Query {
    books: [Book],
    musics: [Music]
  }
`;

const books = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
  ];
  const musics = [
    {
      title: 'Music 1',
      author: 'Author 1',
    },
    {
      title: 'Music 2',
      author: 'Author 2',
    },
  ];
const resolvers = {
    Query: {
      books: () => books,
      musics: () => musics,
    },
    
  };

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
  });
  
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`  Server ready at ${url}`);
  });