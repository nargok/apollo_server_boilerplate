import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authrization';

export default {
  Query: {
    messages: async (
      parent,
      { cursor, limit = 100},
      { models }) => {
        const cursorOptions = cursor
          ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: cursor,
              },
            },
          }
          : {};
      const messages = await models.Message.findAll({
        order: [['createdAt', 'DESC']],
        limit,
        ...cursorOptions,
      });

      return {
        edges: messages,
        pageInfo: {
          endCursor: messages[messages.length - 1].createdAt,
        }
      }

    },
    message: async (parent, { id }, { models }) => {
      return await models.Message.findById(id);
    },
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { me, models }) => {
        return await models.Message.create({
          text,
          userId: me.id
        });
      },
    ),

    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
        async (parent, { id }, { models }) => {
        return await models.Message.destroy({
          where: { id }
        });
      },
    ),
  },

  Message: {
    user: async (message, args, { models }) => {
      return await models.User.findById(message.userId);
    },
  },
};
