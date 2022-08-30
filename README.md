# Book-Search-Engine

## Description

This project aims to showcase my ability in refactoring starter code with a Google Books API search engine built with a RESTful API to use GraphQL API built with Apollo Server. 

## Usage

I was not able to implement the signup/login functionality, but I used the Mongoose models to define query and mutation functionality.

```Javascript
const resolvers = {
  Query: {
    getSingleUser: async () => {
      return User.findOne({
        $or: [
          { _id: user ? user._id : params.id },
          { username: params.username },
        ],
      }).populate("savedBooks");
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
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
  },
};
```

## Links

[Deployed Link](https://booksearchwithmern.herokuapp.com/)

[Project Repository](https://github.com/zzzorigtbaatar/Book-Search-Engine)

## Credits

* Jerome Chenette, UC Berkeley Extension Coding BootCamp

* https://www.npmjs.com/package/apollo-server

* https://www.npmjs.com/package/graphql


## License

[LICENSE](/LICENSE)

## Contact

https://www.linkedin.com/in/zorizulkhuu/

https://github.com/zzzorigtbaatar