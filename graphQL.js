const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
//const { PossibleTypeExtensions } = require('graphql/validation/rules/PossibleTypeExtensions');

const app = express();

const users = [
  {
    id: 0,
    name: "Moose Marshall",
    bio: "Moose",
    accountBirthday: new Date(1647711841),
    friends: [1, 2],
    posts: [0, 3, 6],
    comments: [],
    likedPosts: [5],
    dislikedPosts: [1, 7],
    likedComments: [],
    dislikedComments: [],
  },
  {
    id: 1,
    name: "Kevin Fields",
    bio: "Kevin F",
    accountBirthday: new Date(1647711842),
    friends: [],
    posts: [],
    comments: [],
    likedPosts: [],
    dislikedPosts: [],
    likedComments: [],
    dislikedComments: [],
  },
  {
    id: 2,
    name: "Albert McCarthy",
    bio: "Al",
    accountBirthday: new Date(1647711843),
    friends: [],
    posts: [],
    comments: [],
    likedPosts: [],
    dislikedPosts: [],
    likedComments: [],
    dislikedComments: [],
  },
];

let posts = [
  {
    id: 0,
    uId: 0,
    text: "This website sucks",
    likes: [],
    dislikes: [],
    comments: [],
    time: new Date(1647711843),
  },
  {
    id: 1,
    uId: 1,
    text: "Due to harassment about my website, I am debating removing it",
    likes: [],
    dislikes: [],
    comments: [],
    time: new Date(1647711843),
  },
  {
    id: 2,
    uId: 2,
    text: "Heard the owner might be shutting down this website.",
    likes: [],
    dislikes: [],
    comments: [],
    time: new Date(1647711843),
  },
  {
    id: 3,
    uId: 0,
    text: "Heard this website is finally getting taken down",
    likes: [],
    dislikes: [],
    comments: [],
    time: new Date(1647711843),
  },
  {
    id: 4,
    uId: 1,
    text: "What don't you like about my website?",
    likes: [],
    dislikes: [],
    comments: [],
    time: new Date(1647711843),
  },
  {
    id: 5,
    uId: 2,
    text: "Well for one we have to reply by making new posts",
    likes: [],
    dislikes: [],
    comments: [],
    time: new Date(1647711843),
  },
  {
    id: 6,
    uId: 0,
    text: "Yeah just add comments",
    likes: [],
    dislikes: [],
    comments: [],
    time: new Date(1647711843),
  },
  {
    id: 7,
    uId: 1,
    text: "It's really hard they have to be seperate objects that descend from the post",
    likes: [],
    dislikes: [],
    comments: [],
    time: new Date(1647711843),
  },
  {
    id: 8,
    uId: 2,
    text: "boo hoo",
    likes: [],
    dislikes: [],
    comments: [],
    time: new Date(1647711843),
  },
];

let comments = [
  {
    id: 0,
    pId: 0,
    uId: 1,
    text: "Here you go, this is a comment",
    likes: [],
    dislikes: [],
    time: new Date(1647711943),
  },
  {
    id: 1,
    pId: 0,
    uId: 0,
    text: "ok",
    likes: [],
    dislikes: [],
    time: new Date(1647712843),
  },
  {
    id: 2,
    pId: 0,
    uId: 0,
    text: "Here you go, this is a comment",
    likes: [],
    dislikes: [],
    time: new Date(1647711843),
  },
  {
    id: 3,
    pId: 0,
    uId: 2,
    text: "Here you go, this is a comment",
    likes: [],
    dislikes: [],
    time: new Date(1647711843),
  },
  {
    id: 4,
    pId: 0,
    uId: 1,
    text: "ow",
    likes: [],
    dislikes: [],
    time: new Date(1647711843),
  },
];

const userType = new GraphQLObjectType({
  name: "User",
  description: "This represents a user",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (user) => {
        return users.indexOf(user);
      },
    },
    name: { type: new GraphQLNonNull(GraphQLString) },
    accountBirthday: { type: new GraphQLNonNull(GraphQLInt) },
    bio: { type: GraphQLString },
    friends: {
      type: new GraphQLList(userType),
      resolve: (user) => users.filter((u) => u.friends.includes(user)),
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: (user) => posts.filter((post) => post.uId === user.id),
    },
    comments: {
      type: new GraphQLList(commentType),
      resolve: (user) => comments.filter((comment) => comment.uId === user.id),
    },
    likedPosts: {
      type: new GraphQLList(postType),
      resolve: (user) => posts.filter((post) => post.likes.includes(user)),
    },
    dislikedPosts: {
      type: new GraphQLList(postType),
      resolve: (user) => posts.filter((post) => post.dislikes.includes(user)),
    },
    likedComments: {
      type: new GraphQLList(commentType),
      resolve: (user) =>
        comments.filter((comment) => comment.likes.includes(user)),
    },
    dislikedComments: {
      type: new GraphQLList(commentType),
      resolve: (user) =>
        comments.filter((comment) => comment.dislikes.includes(user)),
    },
  }),
});
const postType = new GraphQLObjectType({
  name: "Post",
  description: "This represents a post",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    uId: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (post) => {
        return users.find((u) => u.posts.includes(post)).id;
      },
    },
    text: { type: new GraphQLNonNull(GraphQLString) },
    time: { type: new GraphQLNonNull(GraphQLString) },
    poster: {
      type: userType,
      resolve: (post) => {
        return users.find((u) => u.id === post.uId);
      },
    },
    likes: {
      type: new GraphQLList(userType),
      resolve: (post) => {
        let catcher = [];
        for (let i = 0; i < users.length; i++) {
          if (users[i].likedPosts.includes(post.id)) {
            catcher.push(users[i]);
          }
        }
        return catcher;
      },
    },
    dislikes: {
      type: new GraphQLList(GraphQLInt),
      resolve: (post) => {
        let catcher = [];
        for (const u of users) {
          if (u.dislikedPosts.includes(post.id)) {
            catcher.push(u);
          }
        }
        return catcher;
      },
    },
    comments: {
      type: new GraphQLList(commentType),
      resolve: (post) => {
        let catcher = [];
        for (const c of comments) {
          if (c.pId === post.id) {
            catcher.push(c);
          }
        }
        return catcher;
      },
    },
  }),
});

const commentType = new GraphQLObjectType({
  name: "comment",
  description: "This is a comment",
  fields: () => ({
    uId: { type: new GraphQLNonNull(GraphQLInt) },
    pId: { type: new GraphQLNonNull(GraphQLInt) },
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (comment) => {
        return posts[comment.pId].length;
      },
    },
    time: { type: new GraphQLNonNull(GraphQLString) },
    uName: {
      type: GraphQLString,
      resolve: (comment) => {
        return users[comment.uId];
      },
      text: { type: new GraphQLNonNull(GraphQLString) },
      likes: {
        type: new GraphQLList(userType),
        resolve: (comment) => {
          let catcher = users.filter((u) =>
            u.likedComments.includes(comment.id)
          );
          return catcher;
        },
      },
      dislikes: {
        type: new GraphQLList(userType),
        resolve: (comment) => {
          let catcher = users.filter((u) =>
            u.dislikedComments.includes(comment.id)
          );
          return catcher;
        },
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    post: {
      type: postType,
      description: "A single post",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parents, args) => posts.find((post) => post.id === args.id),
    },
    allPosts: {
      type: new GraphQLList(postType),
      description: "All Posts",
      resolve: () => posts,
    },
    user: {
      type: userType,
      description: "A single user",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => users.find((user) => user.id === args.id),
    },
    allUsers: {
      type: new GraphQLList(userType),
      description: "All Users",
      resolve: () => users,
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    createPost: {
      type: postType,
      description: "Add a post",
      args: {
        uId: { type: new GraphQLNonNull(GraphQLInt) },
        text: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parents, args) => {
        let post = {
          id: posts.length,
          uId: args.uId,
          text: args.text,
          likes: [],
          dislikes: [],
          comments: [],
          time: new Date(),
        };
        posts.push(post);
        return post;
      },
    },
    likePost: {
      type: postType,
      description: "Like a post",
      args: {
        id: { type: GraphQLInt },
        postId: { type: GraphQLInt },
      },
      resolve: (parents, args) => {
        let catcher = posts.splice(args.postId, 1);
        catcher = {
          ...catcher,
          likes: [...catcher.likes, args.id],
        };
        posts.splice(args.postId, 0, catcher);
        return catcher;
      },
    },
    dislikePost: {
      type: postType,
      description: "Dislike a post",
      args: {
        id: { type: GraphQLInt },
        postId: { type: GraphQLInt },
      },
      resolve: (parents, args) => {
        let catcher = posts.splice(args, postId, 1);
        catcher = {
          ...catcher,
          dislikes: [...catcher.dislikes, args.id],
        };
        posts.splice(args.postId, 0, catcher);
        return catcher;
      },
    },
    addFriend: {
      type: userType,
      description: "Add a friend",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        friendId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parents, args) => {
        let user = users[args.id];
        user.friends = [...user.friends, users[args.friendId]];
        let friend = users[args.friendId];
        friend.friends = [...friend.friends, users[args.id]];
        return friend;
      },
    },
    removeFriend: {
      type: userType,
      description: "Remove a friend",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        friendId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parents, args) => {
        let user = users[args.id];
        user.friends.filter((friend) => friend.id !== args.friendId);
        let friend = users[args.friendId];
        friend.friends.filter((f) => f.id !== args.id);
        return friend;
      },
    },
    makeComment: {
      type: commentType,
      description: "Write a comment",
      args: {
        uId: { type: new GraphQLNonNull(GraphQLInt) },
        pId: { type: new GraphQLNonNull(GraphQLInt) },
        text: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parents, args) => {
        let comments;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.listen(9001, () => console.log("Server is running"));
