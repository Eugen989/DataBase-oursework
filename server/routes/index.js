const Router = require("express");
const router = new Router();

const authorizationRouter = require("./authorizationRouter");
const employeeRouter = require("./employeeRouter");
const restaurantRouter = require("./restaurantRouter");
const reviewsRouter = require("./reviewsRouter");
const reservationRouter = require("./reservationRouter");

router.use("/user", authorizationRouter);
router.use("/employee", employeeRouter);
// router.use("/restaurant", restaurantRouter);
// router.use("/reviews", reviewsRouter);
// router.use("/reservation", reservationRouter);


module.exports = router;