import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { seaquelize } from './models';

const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    me: models.users[1],
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const eraseDetabaseOnSync = true;

seaquelize.sync({ force: eraseDetabaseOnSync }).then(async () => {
  if (eraseDetabaseOnSync) {
    createUserWithMessages();
  }

  app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});

const createUserWithMessages = async () => {
  await models.User.create(
    {
      username: 'admin',
      messages: [
        {
          text: 'Published the Road to learn React',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: 'secondUser',
      messages: [
        {
          text: 'Happy to release ...',
        },
        {
          text: 'Published a complete ...'
        },
      ],
    },
    {
      include: [models.Message]
    },
  );
};
