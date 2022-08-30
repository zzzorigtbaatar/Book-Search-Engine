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
    saveBook: async (parent, { user, body }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: body } },
          { new: true, runValidators: true }
        );
        return {updatedUser};
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    deleteBook: async (parent, { user, params }, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $pull: { savedBooks: { bookId: params.bookId } } },
            { new: true }
          );
  
          return {updatedUser};
        }
        throw new AuthenticationError('You need to be logged in!');
      },
  },
};
