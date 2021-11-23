import { API_URL } from "@/config/index";
import Axios from "axios";

export default async (req, res) => {
  const { userData } = req.body;
  try {
    const response = await Axios.get(
      `${API_URL}/partners/partner?attrs[]=name&attrs[]=contact_person&attrs[]=partner_type&attrs[]=status&attrs[]=id&new_format=true&model=Partners::Partner&order[0][by]=desc&order[0][attr]=date&query={_type:{'$eq':'Partners::Partner'}}`,
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
      res.status(404).json({ message: "Partners not found" });
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.log(e);
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};
