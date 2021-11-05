if (process.env.USER) require("dotenv").config();
const express = require("express");
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const app = express();
const cors = require("cors");

//Import routers to movies, reviews, and theaters
const moviesRouter = require("./movies/movies.router");
const reviewsRouter = require("./reviews/reviews.router");
const theatersRouter = require("./theaters/theaters.router");

//Implement cors for entire app
app.use(cors());
app.use(express.json());

//Route Handlers
app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);
app.use("/theaters", theatersRouter);

//Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
