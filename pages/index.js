import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import DashboardLayout from "@/components/DashboardLayout";
import { isLoggedIn } from "@/utils/utils";
import { API_URL, MERCHANT_API_URL, TOKEN } from "@/config/index";
import jwt from "jsonwebtoken";
import Axios from "axios";

import CardLayout from "@/components/container/CardLayout";
import DetailCard from "@/components/cards/DetailCard";

import CardHolder from "@/components/dashboard/cards/CardSummary";
import TrendHolder from "@/components/dashboard/trends/TrendHolder";
import LineChartCard from "@/components/cards/LineChartCard";

const DashboardPage = ({ userData }) => {
  const [iframeUrl, setIframeUrl] = useState("");

  const [totalWebSubs, setTotalWebSubs] = useState(0);
  const [totalAppSubs, setTotalAppSubs] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalSubs, setTotalSubs] = useState(0);

  const cards = [
    <DetailCard
      text={totalSubs}
      value={totalSubs > 1 ? "Total Subscribers" : "Total Subscriber"}
      key={Math.random().toString(36)}
    />,
    <DetailCard
      text={totalWebSubs}
      value={totalWebSubs > 1 ? "Web Subscribers" : "Web Subscriber"}
      key={Math.random().toString(36)}
    />,
    <DetailCard
      text={totalAppSubs}
      value={totalAppSubs > 1 ? "App Subscribers" : "App Subscriber"}
      key={Math.random().toString(36)}
    />,
    <DetailCard
      text={totalCustomers}
      value={totalCustomers > 1 ? "Total Customers" : "Total Customer"}
      key={Math.random().toString(36)}
    />,

    <DetailCard
      text={4415}
      value="Financial Literacy"
      key={Math.random().toString(36)}
    />,
    <DetailCard
      text={3855}
      value="Digital Literacy"
      key={Math.random().toString(36)}
    />,
  ];

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
        setTotalSubs(result[0] + result[1]);
        setTotalWebSubs(result[0]);
        setTotalAppSubs(result[1]);
        setTotalCustomers(result[2]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadSubs();
  }, []);

  useEffect(() => {
    try {
      const METABASE_SITE_URL = "https://analytics.lecket.gm";
      const METABASE_SECRET_KEY =
        "6eb957ffa2ebc936913f76af11032d5874274bc5a038fe83e04472106d3e4ce8";
      const payload = {
        resource: { dashboard: 3 },
        params: {},
      };
      const token = jwt.sign(payload, METABASE_SECRET_KEY);
      setIframeUrl(
        `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=false`
      );
    } catch (err) {
      console.error(`___METABASE-ERROR___:${err.message}`);
    }
  }, []);

  return (
    <>
      <DashboardLayout userData={userData}>
        <Head>
          <meta description="viewport" content="width=device-width" />
          <title>Dashboard | Lecket</title>
        </Head>
        <Box
          sx={{
            // backgroundColor: "background.default",
            py: 3,
          }}
        >
          <Container maxWidth={"lg"}>
            <Grid container style={{ margin: "0 auto", width: "95vw" }}>
              <Grid item xs={12}>
                <CardLayout cards={cards} />
                {/* <CardHolder />
                <TrendHolder />
                <div
                  style={{
                    display: "flex",
                    flexGrow: 1,
                    padding: 10,
                    width: "99%",
                    margin: "0 auto",
                    filter: "drop-shadow(1px 2px 10px rgba(0,0,0,.15))",
                  }}
                >
                  <div
                    style={{
                      height: "400px",
                      flex: 1,
                      backgroundColor: "white",
                      borderRadius: "6px",
                      padding: 10,
                    }}
                  >
                    <LineChartCard />
                  </div>
                  <div
                    style={{
                      flex: "0 0 25% !important",
                      backgroundColor: "white",
                      marginLeft: "10px",
                      borderRadius: "6px",
                      padding: 10,
                    }}
                  >
                    <h4>Reports</h4>
                    <ul className="report-list">
                      <li>Report A</li>
                      <li>Report B</li>
                      <li>Report C</li>
                      <li>Report D</li>
                      <li>Report E</li>
                      <li>Report F</li>
                      <li>Report G</li>
                    </ul>
                  </div>
                </div> */}
                <iframe
                  id={"dashFrame"}
                  onLoad={() => {}}
                  src={iframeUrl}
                  frameBorder="0"
                  style={{ height: "100vh", width: "95vw" }}
                  overflow="hidden"
                ></iframe>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default DashboardPage;

export async function getServerSideProps({ req }) {
  const userData = isLoggedIn(req);
  if (userData) {
    return {
      props: { userData },
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
