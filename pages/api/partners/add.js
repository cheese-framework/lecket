import { API_URL } from "@/config/index";
import Axios from "axios";

export default async (req, res) => {
  if (req.method === "POST") {
    const { name, person, email, number, access, type, status, userData } =
      req.body;
    try {
      const response = await Axios.post(
        `${API_URL}/partners/partner`,
        {
          name,
          contact_person: person,
          contact_email: email,
          contact_number: number,
          access,
          partner_type: type,
          status,
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
      if (response.data.success) {
        res.status(200).send({ success: "Partner added successfully" });
      } else {
        res
          .status(500)
          .json({ error: "Something went wrong. Could not add partner" });
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.log(err);
      }
      res.status(500).json({ error: "Could not add partner" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};
