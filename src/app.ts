import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { booksRouter } from "./routes/books.routes.js";
import { reviewsRouter } from "./routes/reviews.routes.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

export const app: Express = express();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

await apolloServer.start();

// middleware
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/graphql", express.json(), expressMiddleware(apolloServer));

// routes
app.use("/api/v1/books", booksRouter);
app.use("/api/v1/books", reviewsRouter);

// error handlers
app.use(notFoundMiddleware);
app.use(errorMiddleware);