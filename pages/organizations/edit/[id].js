import EditPage from "@/components/organizations/EditPage";
import { INTERNAL_API_URL } from "@/config/index";
import { isLoggedIn } from "@/utils/utils";
import Axios from "axios";

export default function OrganizationEdit({ organization, id, userData }) {
  return <EditPage data={organization} id={id} userData={userData} />;
}

export async function getServerSideProps({ query: { id }, req }) {
  const userData = isLoggedIn(req);
  let organization = [];
  if (userData) {
    try {
      const response = await Axios.post(`/api/organizations/get`, {
        userData,
        id,
      });
      organization = response.data;
    } catch (err) {
      console.log(err);
    }
    return {
      props: {
        organization,
        userData,
        id,
      },
    };
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
