const express = require("express");
const { registerUser, loginUser, getSingleUser, getAllUsers, updateUser, deleteUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getSingleUser);
router.get("/all", protect, getAllUsers);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

module.exports = router;
