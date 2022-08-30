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
    saveBook: async (parent, { input }, context) => {
        if (context.user) {
            const book = await Book.create({
              input
            });
    
            await User.findOneAndUpdate(
              { _id: context.user._id },
              { $addToSet: { savedBooks: book._id } },
              { new: true, runValidators: true }
            );
    
            return User;
          }
      throw new AuthenticationError('You need to be logged in!');
    },
    deleteBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const book = await Book.findOneAndDelete({
              bookId: bookId,
            });
    
            await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { savedBooks: book._id } },
              { new: true}
            );
    
            return User;
        }
        throw new AuthenticationError('You need to be logged in!');
      },
  },
};
