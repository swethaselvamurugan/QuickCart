const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../../models/user")

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email });
        if (checkUser) return res.json({ success: false, message: "User already exist with same email! Please try again." })
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, email, password: hashPassword });
        await newUser.save();
        return res.status(200).json({
            success: true,
            message: "Registration successfull."
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Some error occured."
        });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.json({
                success: false,
                message: "User doesn't exists! Please register first."
            })
        }
        const checkPassword = await bcrypt.compare(password, checkUser.password)
        if (!checkPassword) {
            return res.json({
                success: false,
                message: "Incorrect password! Please try again."
            })
        }
        const token = jwt.sign({
            id: checkUser._id,
            role: checkUser.role,
            email: checkUser.email,
            username: checkUser.username
        }, "CLIENT_SECRET_KEY", { expiresIn: "60m" })
        return res.cookie("token", token, { httpOnly: true, secure: true }).json({
            success: true,
            message: "Logged in successfully",
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                username: checkUser.username
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Some error occured."
        });
    }
}

const logout = (req, res) => {
    return res.clearCookie("token").json({
        success: true,
        message: "Logged out successfully!"
    })
}

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({
        success: false,
        message: "Unauthorised user!"
    });
    try {
        const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorised user!"
        });
    }
}

module.exports = { register, login, logout, authMiddleware };