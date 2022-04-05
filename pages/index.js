import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import DashboardLayout from "@/components/DashboardLayout";
import { isLoggedIn } from "@/utils/utils";
import jwt from "jsonwebtoken";
import CardHolder from "@/components/dashboard/cards/CardSummary";
import TrendHolder from "@/components/dashboard/trends/TrendHolder";
import LineChartCard from "@/components/cards/LineChartCard";

const DashboardPage = ({ userData }) => {
  const [iframeUrl, setIframeUrl] = useState("");

  useEffect(() => {
    try {
      const METABASE_SITE_URL = "https://analytics.lecket.gm";
      const METABASE_SECRET_KEY =
        "6eb957ffa2ebc936913f76af11032d5874274bc5a038fe83e04472106d3e4ce8";
      const payload = {
        resource: { dashboard: 2 },
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
                <CardHolder />
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
                </div>
                {/* <iframe
                  id={"dashFrame"}
                  onLoad={() => {}}
                  src={iframeUrl}
                  frameBorder="0"
                  style={{ height: "100vh", width: "95vw" }}
                  overflow="hidden"
                ></iframe> */}
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
