import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            req.user = null
            return next()
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)
        next()
    } catch (error) {
        req.user = null
        next()
    }
}

export default optionalAuth
