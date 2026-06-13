import jwt from "jsonwebtoken";

const authMiddleware = (
  req,
  res,
  next
) => {
  try {
    // GET TOKEN
    const token =
      req.headers.authorization?.split(
        " "
      )[1];

    // NO TOKEN
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // SAVE USER
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

export default authMiddleware;