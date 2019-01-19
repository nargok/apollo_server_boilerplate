import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async () => ({
    models,
    me: await models.User.findByLogin('admin'),
    secret: process.env.SECRET,
  }),
});

server.applyMiddleware({ app, path: '/graphql' });

const eraseDetabaseOnSync = true;

sequelize.sync({ force: eraseDetabaseOnSync }).then(async () => {
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
      email: 'admin@example.com',
      passowrd: 'password',
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
      email: 'sedonduser@example.com',
      password: 'password',
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
