
const user = (seaquelize, DataTypes) => {
  const User = seaquelize.define('user', {
    username: {
      type: DataTypes.STRING,
    },
  });

  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };

  return User;
};

export default user;
