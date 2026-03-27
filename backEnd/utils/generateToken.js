import jwt from "jsonwebtoken"

const generateToken = (res, user) => {
    const token = jwt.sign(
    {
      userId: user._id,
      cmp_id: user.selected?.[0]?.company_id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15m",
    }
  );
console.log("token",token)

  res.cookie("jwt_primary", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 15*60* 1000
  })
  return token
}

export default generateToken
