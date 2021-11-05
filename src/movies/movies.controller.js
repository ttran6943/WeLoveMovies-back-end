const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//ASYNC FUNCTIONS//

//.get: ("/") or ("/?is_showing") list function
async function list(req, res, next) {
  //checks if query exists and calls approriate functions for true and false cases
  const query = req.query.is_showing;
  if (!query) {
    listAllMovies(req, res, next);
  } else if (query == "true") {
    listMoviesInTheaters(req, res, next);
  }
}

//list all movies if no query
async function listAllMovies(req, res, next) {
  const resultList = await service.listAllMovies();
  res.json({ data: resultList });
}

//list all movies that are ONLY showing in theaters ("/?is_showing" is set to true)
async function listMoviesInTheaters(req, res, next) {
  const resultList = await service.listMoviesInTheaters();
  res.json({ data: resultList });
}

//.get: ("/:movieId") read function
function read(req, res, next) {
  res.json({ data: res.locals.movie });
}

//MIDDLEWARES//

//validates movieId corresponds to a movie with that id
async function movieExists(req, res, next) {
  const { movieId } = req.params;
  //if route = ("/theaters"): fetches movie and theaters at which the movie is shown at
  if (req.originalUrl.includes("theaters")) {
    const movieAndTheaters = await service.readMovieAtTheaters(movieId);
    if (movieAndTheaters) {
      res.locals.movie = movieAndTheaters;
      return next();
    }
    //if route = ("/reviews"): fetches movies and their corresponding reviews
  } else if (req.originalUrl.includes("reviews")) {
    const movieAndReviews = await service.readMovieAndReviews(movieId);
    if (movieAndReviews) {
      res.locals.movie = movieAndReviews;
      return next();
    }
    //if route = ("/"): fetches movie with corresponding movieId
  } else {
    const movie = await service.read(movieId);
    if (movie) {
      res.locals.movie = movie;
      return next();
    }
  }
  //if invalid route or no movieId that corresponds to a movie, then 404
  return next({
    status: 404,
    message: `Movie cannot be found.`,
  });
}

module.exports = {
  read: [asyncErrorBoundary(movieExists), read],
  list,
};
