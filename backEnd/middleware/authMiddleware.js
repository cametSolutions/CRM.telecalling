import jwt from "jsonwebtoken"
const authMiddleware = (req, res, next) => {
  const cookieToken = req.cookies?.jwt_primary
  const authorization = req.headers.authorization || ""
  const bearerToken = authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : null
  const token = cookieToken || bearerToken
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
console.log(decoded)
    req.owner = decoded
   req.cmp_id = decoded.cmp_id;

    next()
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" })
  }
}

export default authMiddleware
