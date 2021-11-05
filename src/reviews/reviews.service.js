const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

//Defines and maps critics properties nested within the reviews table
const addCritic = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

//returns a review that corresponds to given reviewId
function read(reviewId) {
  return knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .first();
}

//updates review that corresponds to the given reviewId
function update(reviewId, updatedReview) {
  return knex("reviews")
    .where({ review_id: reviewId })
    .update(updatedReview);
}

//appends properties of the critics table to the reviews table
function addCritics(reviewId) {
  return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .where({ review_id: reviewId })
    .first()
    .then(addCritic);
}

//deletes review that corresponds to the given reviewId
function destroy(reviewId) {
  return knex("reviews")
    .where({ review_id: reviewId })
    .del();
}

module.exports = {
  addCritics,
  read,
  update,
  destroy,
};
