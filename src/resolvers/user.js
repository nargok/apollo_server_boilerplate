export default {
  Query: {
    me: async (parent, args, { models, me }) => {
      return await models.User.findById(me.id);
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findById(id);
    },
    users: async (parent, { id }, { models }) => {
      return await models.User.findAll();
    },
  },

  User: {
    messages: async (user, args, { models }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id
        }
      })
    },
  },
};
