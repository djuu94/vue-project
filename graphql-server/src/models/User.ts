// src/models/User.ts

import { builder } from "../builder";
import { prisma } from "../db";

builder.prismaObject("User", {
  fields: t => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    email: t.exposeString("email"),
    password: t.exposeString('password'),
    favoriteMovies: t.relation("favoriteMovies"),
  }),
})

builder.queryField("users", (t) =>
  t.prismaField({
    type: ["User"],
    resolve: async (query, root, args, ctx, info) => {
      return prisma.user.findMany({ ...query });
    },
  })
);


builder.mutationField("createUser", (t) =>
  t.prismaField({
    type: "User", 
    args: {
      name: t.arg.string({ required: true }),
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args, ctx, info) => {
      return prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: args.password,
        },
      });
    },
  })
);

//Login User
builder.mutationField("loginUser", (t) =>
  t.prismaField({
    type: "User", 
    args: { 
      name: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args, ctx, info) => {
      const user = await prisma.user.findFirst({  
        where: {
          name: args.name,
          password: args.password, 
        },
      });

      if (!user) {
        throw new Error('Invalid username or password');
      }

      return user;
    },
  })
);

builder.prismaObject("FavoriteMovie", {
  fields: (t) => ({
      id: t.exposeID("id"),
      movieId: t.exposeString("movieId"),
      userId: t.exposeInt("userId")
  }),
});
builder.mutationField("addFavoriteMovie", (t) =>
  t.prismaField({
    type: "FavoriteMovie", 
    args: { 
      userId: t.arg.int({ required: true }),
      movieId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args, ctx, info) => {
      return prisma.favoriteMovie.create({
        data: {
          userId: args.userId,
          movieId: args.movieId,
        },
      });
    },
  })
);


builder.mutationField("removeFavoriteMovie", (t) =>
  t.prismaField({
    type: "FavoriteMovie", 
    args: { 
      id: t.arg.int({ required: true }),
    },
    resolve: async (query, root, args, ctx, info) => {
      return prisma.favoriteMovie.delete({
        where: {
          id: args.id,
        },
      });
    },
  })
);