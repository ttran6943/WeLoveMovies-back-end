const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

//defines properties from the movies table to be appended to the theaters table
const addMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  title: ["movies", null, "title"],
  rating: ["movies", null, "rating"],
});

//returns the theaters table with movies properties nested inside the theaters table
function list() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select("t.*", "m.*")
    .where({ "mt.is_showing": true })
    .then(addMovies);
}

module.exports = {
  list,
};
