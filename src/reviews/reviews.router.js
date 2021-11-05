const controller = require("./reviews.controller");
const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const { Router } = require("express");

router 
    .route("/:reviewId")
    .put(controller.update)
    .delete(controller.delete)
    .all(methodNotAllowed);


module.exports = router;
 