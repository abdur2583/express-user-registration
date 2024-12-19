const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// Register User
const registerUser = async (req, res) => {
    const { firstName, lastName, NIDNumber, phoneNumber, password, bloodGroup } = req.body;

    try {
        const userExists = await User.findOne({ NIDNumber });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ firstName, lastName, NIDNumber, phoneNumber, password, bloodGroup });
        const token = generateToken(user._id);

        res.cookie("token", token, { httpOnly: true });
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user._id);
        res.cookie("token", token, { httpOnly: true });
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single User
const getSingleUser = async (req, res) => {
    res.json(req.user);
};

// Get All Users
const getAllUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

// Update User
const updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getSingleUser, getAllUsers, updateUser, deleteUser };
