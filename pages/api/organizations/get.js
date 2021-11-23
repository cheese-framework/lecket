import { API_URL } from "@/config/index";
import Axios from "axios";

export default async (req, res) => {
  const { userData, id } = req.body;
  try {
    const response = await Axios.get(`${API_URL}/organizations_v2/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `token ${userData.auth_token}`,
        UserProfile: userData.profile,
        UserKey: userData.UserKey,
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(404).json({ message: "No record found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Could not load organization data" });
    if (process.env.NODE_ENV === "development") {
      console.log(err);
    }
  }
};
