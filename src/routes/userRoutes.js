const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  enrollUser,
  getEnrolls,
  payEnroll,
} = require("../controllers/userControllers");

router.post("/enroll-user", enrollUser);
router.get("/get-enrolls/:mobile", getEnrolls);
router.post("/pay-enroll/:id", payEnroll);

module.exports = router;
