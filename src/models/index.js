import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize (
  process.env.TEST_DATABASE || process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
  },
);

const models = {
  User: sequelize.import('./user'),
  Message: sequelize.import('./message'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
// let users = {
//   1: {
//     id: '1',
//     firstname: 'Robin',
//     lastname: 'Wieruch',
//     messageIds: [1],
//   },
//   2: {
//     id: '2',
//     firstname: 'Dave',
//     lastname: 'Davids',
//     messageIds: [2],
//   },
// };

// let messages = {
//   1: {
//     id: '1',
//     text: 'Hello World',
//     userId: '1',
//   },
//   2: {
//     id: '2',
//     text: 'By World',
//     userId: '2',
//   },
// };

// export default {
//   users,
//   messages,
// };

