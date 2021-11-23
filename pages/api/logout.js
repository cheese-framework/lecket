import cookie from "cookie";

export default async (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("user", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 0,
      sameSite: "strict",
      path: "/",
    })
  );
  res.status(200).json({ success: 1 });
};
