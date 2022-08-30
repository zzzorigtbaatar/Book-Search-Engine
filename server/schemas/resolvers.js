const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        getSingleUser: async () => {
            return User.findOne({
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
              }).populate('books');
        },
    }
}