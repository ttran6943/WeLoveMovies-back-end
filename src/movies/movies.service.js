const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

//adds critic nested inside of movies
const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

//lists all movies
function listAllMovies() {
  return knex("movies").select("*");
}

//lists all movies that are showing in theaters
function listMoviesInTheaters() {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .distinct("m.*")
    .where({ "mt.is_showing": true });
}

//returns a movie with the given movieId
function read(movieId) {
  return knex("movies as m")
    .select("m.*")
    .where({ movie_id: movieId })
    .first();
}

//reads a movieId and returns theaters that are playing the movie with the movieId
function readMovieAtTheaters(movieId) {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("t.*", "m.movie_id")
    .where({
      "mt.is_showing": true,
      "m.movie_id": movieId,
    });
}

//nests critics inside of movies
function readMovieAndReviews(movieId) {
  return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("r.*", "c.*")
    .where({
      "r.movie_id": movieId,
    })
    .then((reviews) => reviews.map(review => addCritic(review)));
}

module.exports = {
  listAllMovies,
  listMoviesInTheaters,
  readMovieAtTheaters,
  readMovieAndReviews,
  read,
};
