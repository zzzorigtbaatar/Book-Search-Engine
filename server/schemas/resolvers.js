const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    getSingleUser: async () => {
      return User.findOne({
        $or: [
          { _id: user ? user._id : params.id },
          { username: params.username },
        ],
      }).populate("books");
    },
  },

  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      //create a User document with the input parameters
      const user = await User.create({ username, email, password });
      //generate a token from this newly created User
      const token = signToken(user);
      //return an object with the token and the User document
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
  },
};
