const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./theaters.service");


//ASYNC FUNCTIONS//

//lists all theaters and all the movies each corresponding theater is showing
async function list(req, res, next) {
    const listAllTheaters = await service.list(); //fetches list of theaters
    res.json({ data: listAllTheaters });
}

module.exports = {
    list: asyncErrorBoundary(list),
}