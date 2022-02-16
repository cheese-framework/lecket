import cookie from "cookie";

export default async (req, res) => {
  if (req.method === "POST") {
    const { data, r, remember } = req.body;
    try {
      const DATA = { ...data, UserKey: r };

      // add email and password to cookies
      if (remember) {
        res.setHeader("Set-Cookie", [
          cookie.serialize(
            "remember_user",
            JSON.stringify({ email, password }),
            {
              httpOnly: true,
              secure: process.env.NODE_ENV !== "development",
              maxAge: 60 * 60 * 24 * 7,
              sameSite: "strict",
              path: "/",
            }
          ),
          cookie.serialize("user", JSON.stringify(DATA), {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60 * 24,
            sameSite: "strict",
            path: "/",
          }),
        ]);
      } else {
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("user", JSON.stringify(DATA), {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60 * 24,
            sameSite: "strict",
            path: "/",
          })
        );
      }

      res.status(200).json({ success: "Authenticated successfully" });
    } catch (e) {
      res.status(500).json({ error: e.message || "Authentication error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};
