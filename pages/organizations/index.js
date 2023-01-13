import { useEffect, useCallback, useState } from "react";
import Head from "next/head";
import { Container } from "@mui/material";
import DashboardLayout from "@/components/DashboardLayout";
import OrganizationSummary from "@/components/organizations/OrganizationSummary";
import Axios from "axios";
import { isLoggedIn } from "@/utils/utils";
import { FINANCE, API_URL, MERCHANT_API_URL, TOKEN } from "@/config/index";

const Subscribers = ({ userData }) => {
  const [totalWebSubs, setTotalWebSubs] = useState(0);
  const [totalAppSubs, setTotalAppSubs] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalSubs, setTotalSubs] = useState(0);

  const loadAppSubscribers = async () => {
    try {
      const { data } = await Axios.get(
        `${MERCHANT_API_URL}/merchants?limit=1`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (data) {
        return data.total;
      }
      return 0;
    } catch (err) {
      return 0;
    }
  };

  const loadCustomers = async () => {
    try {
      const { data } = await Axios.get(
        `${MERCHANT_API_URL}/customers?limit=1`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (data) {
        return data.total;
      }
      return 0;
    } catch (err) {
      return 0;
    }
  };

  const loadWebSubscribers = async () => {
    try {
      const { data } = await Axios.get(
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

      if (data) {
        return data.total;
      }
      return 0;
    } catch (e) {
      return 0;
    }
  };

  const loadSubs = async () => {
    Promise.all([loadWebSubscribers(), loadAppSubscribers(), loadCustomers()])
      .then((result) => {
        if (result.length > 0) {
          setTotalSubs(result[0] + result[1]);
          setTotalWebSubs(result[0]);
          setTotalAppSubs(result[1]);
          setTotalCustomers(result[2]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadSubs();
  }, []);

  return (
    <>
      <DashboardLayout userData={userData}>
        <Head>
          <meta description="viewport" content="width=device-width" />
          <title>Subscribers | Lecket</title>
        </Head>
        <Container maxWidth={"lg"}>
          <OrganizationSummary
            totalOrganizations={totalSubs}
            userData={userData}
            appSubs={totalAppSubs}
            webSubs={totalWebSubs}
            customers={totalCustomers}
          />
        </Container>
      </DashboardLayout>
    </>
  );
};

export default Subscribers;

export async function getServerSideProps({ req }) {
  const userData = isLoggedIn(req);
  if (userData) {
    if (userData.user_type !== FINANCE) {
      return {
        props: {
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
