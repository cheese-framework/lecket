import { API_URL } from "@/config/index";
import Axios from "axios";

export default async (req, res) => {
  if (req.method === "POST") {
    const { userData, data, id } = req.body;
    try {
      const response = await Axios.put(
        `${API_URL}/organizations_v2/${id}`,
        {
          ...data,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `token ${userData.auth_token}`,
            UserProfile: userData.profile,
            UserKey: userData.UserKey,
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
      if (response.data) {
        res.status(200).json({ updatedData: response.data.data });
      } else {
        res.status(500).json({
          error: "Something went wrong. Could not update organization.",
        });
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.log(err);
      }
      res.status(500).json({
        error: "Something went wrong. Could not update organization.",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};
