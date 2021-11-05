const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//designates valid body structure for put request
const VALID_REVIEW_PROPERTIES = ["score", "content"];

//ASYNC FUNCTIONS//

//updates the review that corresponds to given reviewId
async function update(req, res, next) {
  const { reviewId } = req.params;
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };

  //updates the review
  await service.update(reviewId, updatedReview);
  const updatedWithCritics = await service.addCritics(reviewId); //nests critics inside of the updated body
  res.json({ data: updatedWithCritics });
}

//deletes review that corresponds to given reviewId and returns 204 if deletion is successful
async function destroy(req, res, next) {
  const { reviewId } = req.params;
  await service.destroy(reviewId);
  res.sendStatus(204);
}

//MIDDLEWARE//

//validates a reviewId matches a review otherwise returns a 404 error
async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const foundReview = await service.read(reviewId);
  if (foundReview) {
    res.locals.review = foundReview;
    return next();
  } else {
    return next({
      status: 404,
      message: `Review cannot be found.`,
    });
  }
}

//validates put request containing correct body structure
function hasOnlyValidReviewProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_REVIEW_PROPERTIES.includes(field)
  );
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

module.exports = {
  update: [
    asyncErrorBoundary(reviewExists),
    hasOnlyValidReviewProperties,
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ]
};
