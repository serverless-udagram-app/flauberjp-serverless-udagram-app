import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";
import { getAllGroups } from "../../businessLogic/groups";
import * as express from "express";
import * as awsServerlessExpress from "aws-serverless-express";

const app = express();

app.get("/groups", async (_req, res) => {
  console.log("Handeling get groups request: ", _req);

  const items = await getAllGroups();

  // Return a list of groups
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.json({
    items,
  });
});

// Create Express server
const server = awsServerlessExpress.createServer(app);
// Pass API Gateway events to the Express server
exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
