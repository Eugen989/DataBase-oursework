const Router = require("express");
const router = new Router();

const authorizationRouter = require("./authorizationRouter");
const employeeRouter = require("./employeeRouter");
const sheduleRouter = require("./sheduleRouter");
const materialRouter = require("./materialRouter");
const productRouter = require("./productRouter");
const gemRouter = require("./gemRouter");
const productGemRouter = require("./productGemRouter");
const soldProductRouter = require("./soldProductRouter");

const restaurantRouter = require("./restaurantRouter");

router.use("/authorization", authorizationRouter);
router.use("/employee", employeeRouter);
router.use("/shedule", sheduleRouter);
router.use("/material", materialRouter);
router.use("/product", productRouter);
router.use("/gem", gemRouter);
router.use("/product_gem", productGemRouter);
router.use("/soldProduct", soldProductRouter);

module.exports = router;