import Express from "express";
import cors from "cors";
import helmet from "helmet";
import { ErrorMiddleware } from "./Error/Error.middleware";
import { Router } from "./router/router";

// Create Express app
const app = Express();

// Aplly configuration
app.use(Express.json());

// Enable CORS
app.use(cors({ origin: "*" }));

// Apply Helmet for security
app.use(helmet());

// Aplly Router
app.use(Router)

// Aplly Error Mindleware
app.use(ErrorMiddleware);

// Initial server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
