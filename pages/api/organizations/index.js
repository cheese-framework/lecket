import { API_URL } from "@/config/index";
import Axios from "axios";

export default async (req, res) => {
  const { userData } = req.body;
  try {
    const response = await Axios.get(
      `${API_URL}/organizations_v2?from_admin=true&attrs=&page=1&size=1&new_format=true&model=&order[0][by]=asc&order[0][attr]=created_at&query={_type: 'Afrijula'}`,
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
      res.status(200).json(response.data);
    } else {
      res.status(404).json({ message: "Organizations not found" });
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.log(e);
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};
