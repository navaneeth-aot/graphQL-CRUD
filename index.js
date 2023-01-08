const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  graphql,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");

const app = express();

const PORT = 3000;

const owners = [
  { id: 1, name: "John Astle" },
  { id: 2, name: "Goutam sharma" },
  { id: 3, name: "Kane Williamson" },
];

const websites = [
  { id: 1, name: "Facebook", ownerID: "101" },
  { id: 2, name: "Google", ownerID: "102" },
  { id: 3, name: "Amazon", ownerID: "103" },
  { id: 4, name: "Github", ownerID: "104" },
  { id: 5, name: "Medium", ownerID: "105" },
  { id: 6, name: "Baidu", ownerID: "106" },
  { id: 7, name: "Zapak", ownerID: "107" },
  { id: 8, name: "Cricinfo", ownerID: "108" },
];

const WebsiteType = new GraphQLObjectType({
  name: "Website",
  description: "This represents a website made by the owner(programmer)",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    ownerID: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const OwnerType = new GraphQLObjectType({
  name: "Owner",
  description: "This represents a Owner",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    websites: {
      type: new GraphQLList(WebsiteType),
      description: "List of all Websites",
      resolve: () => websites,
    },
    owners: {
      type: new GraphQLList(OwnerType),
      description: "List of all Owners",
      resolve: () => owners,
    },
    Website: {
      type: WebsiteType,
      description: "A single wesite",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        websites.find((website) => website.id === args.id),
    },
    Owner: {
      type: OwnerType,
      description: "A singr owner",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => owners.find((owners) => owners.id === args.id),
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addWebsite: {
      type: WebsiteType,
      description: "Add a website",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        ownerID: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const website = {
          id: websites.length + 1,
          name: args.name,
          ownerID: args.ownerID,
        };
        websites.push(website);
        return website;
      },
    },

    removeWebsite: {
      type: WebsiteType,
      description: "Remove a website",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        websites = websites.filter((website) => website.id !== args.id);
        return websites[args.id];
      },
    },

    addOwner: {
      type: OwnerType,
      description: "Add an Owner",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const owner = { id: owners.length + 1, name: args.name };
        owners.push(owner);
        return owner;
      },
    },

    removeOwner: {
      type: OwnerType,
      description: "Remove an Owner",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        owners = owners.filter((owner) => owner.id !== args.id);
        return owners[args.id];
      },
    },

    UpdateWebsite: {
      type: WebsiteType,
      description: "Update a website",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        websites[args.id - 1].name = args.name;
        return websites[args.id - 1];
      },
    },

    UpdateOwner: {
      type: OwnerType,
      description: "Update a Owner",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        owners[args.id - 1].name = args.name;
        return owners[args.id - 1];
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
    graphiql: true,
    schema: schema,
  })
);

app.listen(PORT, () => {
  console.log(`app is listening on the ${PORT}`);
});
