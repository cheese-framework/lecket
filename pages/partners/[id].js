import { useContext } from "react";
import DetailPage from "@/components/partners/DetailPage";
import { INTERNAL_API_URL, FINANCE } from "@/config/index";
import { isLoggedIn } from "@/utils/utils";
import Axios from "axios";
import LecketContext from "@/context/LecketContext";

export default function PartnerDetails({ partner, id, userData }) {
  const { appTheme } = useContext(LecketContext);

  return (
    <DetailPage data={partner} id={id} userData={userData} theme={appTheme} />
  );
}

export async function getServerSideProps({ query: { id }, req }) {
  const userData = isLoggedIn(req);
  let partner = [];
  if (userData) {
    if (userData.user_type !== FINANCE) {
      try {
        const response = await Axios.post(
          `${INTERNAL_API_URL}/api/partners/get`,
          {
            userData,
            id,
          }
        );
        partner = response.data;
      } catch (err) {
        console.log(err);
      }
      return {
        props: {
          partner,
          userData,
          id,
        },
      };
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/403",
        },
        props: {},
      };
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
}
