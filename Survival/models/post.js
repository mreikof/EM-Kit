module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
       id: {
  			type: DataTypes.INTEGER,
  			primaryKey: true,
  			autoIncrement: true
  		},
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
      validate: {
        isEmail: true
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: ""
    }
  });

  Post.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without a list due to the foreign key constraint
    Post.belongsTo(models.User, {
      foreignKey: {
        email:Post.email
      }
    });
  };

  return Post;
};
