import cookie from "cookie";

export default async (req, res) => {
  const { theme } = req.body;
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("theme", theme, {
      httpOnly: false,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "strict",
      path: "/",
    })
  );

  res.status(200).json({ success: "Theme set successfully" });
};
