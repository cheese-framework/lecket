import cookie from "cookie";
import { API_URL } from "../../config/index";
import Axios from "axios";

export default async (req, res) => {
  if (req.method === "POST") {
    const { email, password, influence, r, remember } = req.body;
    try {
      const response = await Axios.post(
        `https://api.lecket.gm/account/authenticate_v2/authenticate`,
        {
          email,
          password,
          influence,
          r,
        },
        {
          headers: {
            UserKey: r,
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
      if (response.status === 200) {
        const data = { ...response.data, UserKey: r };

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
            cookie.serialize("user", JSON.stringify(data), {
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
            cookie.serialize("user", JSON.stringify(data), {
              httpOnly: true,
              secure: process.env.NODE_ENV !== "development",
              maxAge: 60 * 60 * 24,
              sameSite: "strict",
              path: "/",
            })
          );
        }

        res.status(200).json({ success: "Authenticated successfully" });
      } else {
        res.status(401).json({ error: "Unauthorize" });
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.log(e);
      }
      res.status(500).json({ error: "Authentication error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};
