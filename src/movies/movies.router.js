const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
    .route("/")
    .get(controller.list)
    .all(methodNotAllowed);

router
    .route("/?is_showing=true")
    .get(controller.list)
    .all(methodNotAllowed);

router
    .route("/:movieId/theaters")
    .get(controller.read)
    .all(methodNotAllowed);

router
    .route("/:movieId/reviews")
    .get(controller.read)
    .all(methodNotAllowed);

router
    .route("/:movieId")
    .get(controller.read)
    .all(methodNotAllowed);

module.exports = router;
