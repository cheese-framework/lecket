import { INTERNAL_API_URL, FINANCE } from "@/config/index";
import Head from "next/head";
import { Container } from "@mui/material";
import DashboardLayout from "@/components/DashboardLayout";
import PartnerSummary from "@/components/partners/PartnerSummary";
import Axios from "axios";
import cookie from "cookie";

const Partners = ({ partners, userData }) => {
  return (
    <>
      <DashboardLayout userData={userData}>
        <Head>
          <meta description="viewport" content="width=device-width" />
          <title>Partners | Lecket</title>
        </Head>

        <Container maxWidth={"lg"}>
          <PartnerSummary partners={partners} />
        </Container>
      </DashboardLayout>
    </>
  );
};

export default Partners;

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || "");
  let partners = [];
  if (cookies && cookies.user) {
    const userData = JSON.parse(cookies.user);
    if (userData.user_type !== FINANCE) {
      try {
        const response = await Axios.post(`/api/partners`, {
          userData,
        });
        partners = response.data;
      } catch (err) {
        console.log(err);
      }
      return {
        props: {
          partners,
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
