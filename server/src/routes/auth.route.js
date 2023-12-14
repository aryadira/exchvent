const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

// REGISTERING

// register as a user
router.post("/user/register", async (req, res) => {
  await authController.signUp(req.body, "user", res);
});

// register as a creator
router.post("/creator/register", async (req, res) => {
  await authController.signUp(req.body, "creator", res);
});

// register as a admin
router.post("/admin/register", async (req, res) => {
  await authController.signUp(req.body, "admin", res);
});

// LOGING

// login as a user
router.post("/user/login", async (req, res) => {
  await authController.login(req.body, "user", res);
});

// login as a creator
router.post("/creator/login", async (req, res) => {
  await authController.login(req.body, "creator", res);
});

// login as a admin
router.post("/admin/login", async (req, res) => {
  await authController.login(req.body, "admin", res);
});

// PROTECTING

// user protected
router.get("/protected-user", authMiddleware.userAuth, authMiddleware.checkRole(["user"]), async (req, res) => {
  return res.json(`Welcome ${req.body.username}`);
});

// creator protected
router.get("/protected-creator", authMiddleware.userAuth, authMiddleware.checkRole(["creator"]), async (req, res) => {
  return res.json(`Welcome ${req.body.username}`);
});

router.get("/protected-admin", authMiddleware.userAuth, authMiddleware.checkRole(["admin"]), async (req, res) => {
  return res.json(`Welcome ${req.body.username}`);
});

module.exports = router;
