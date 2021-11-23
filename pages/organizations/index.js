import { INTERNAL_API_URL } from "@/config/index";
import Head from "next/head";
import { Container } from "@mui/material";
import DashboardLayout from "@/components/DashboardLayout";
import OrganizationSummary from "@/components/organizations/OrganizationSummary";
import Axios from "axios";
import { isLoggedIn } from "@/utils/utils";
import { FINANCE } from "@/config/index";

const Subscribers = ({ organizations, userData }) => {
  return (
    <>
      <DashboardLayout userData={userData}>
        <Head>
          <meta description="viewport" content="width=device-width" />
          <title>Subscribers | Lecket</title>
        </Head>
        <Container maxWidth={"lg"}>
          <OrganizationSummary
            totalOrganizations={organizations ? organizations.total : 0}
            userData={userData}
          />
        </Container>
      </DashboardLayout>
    </>
  );
};

export default Subscribers;

export async function getServerSideProps({ req }) {
  const userData = isLoggedIn(req);
  let organizations = [];
  if (userData) {
    if (userData.user_type !== FINANCE) {
      try {
        const response = await Axios.post(
          `${INTERNAL_API_URL}/api/organizations`,
          {
            userData,
          }
        );
        organizations = response.data;
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.log(err);
        }
      }
      return {
        props: {
          organizations,
          userData,
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
