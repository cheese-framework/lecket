import EditSettingsPage from "@/components/organizations/EditSettingsPage";
import { isLoggedIn } from "@/utils/utils";

export default function OrganizationEdit({ id, userData }) {
  return <EditSettingsPage id={id} userData={userData} />;
}

export async function getServerSideProps({ query: { id }, req }) {
  const userData = isLoggedIn(req);

  if (userData && id) {
    return {
      props: {
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
