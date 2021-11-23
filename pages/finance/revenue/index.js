import { useState, useContext } from "react";
import { isLoggedIn } from "@/utils/utils";
import Head from "next/head";
// import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import RevenueTable from "@/components/revenue/RevenueTable";
import DownloadIcon from "@mui/icons-material/Download";
import styles from "@/styles/DetailPage.module.css";
import { API_URL, compileQuery, FINANCE } from "@/config/index";
import LecketContext from "@/context/LecketContext";

export default function Revenue({ userData }) {
  const [loading, setLoading] = useState(false);
  const { appTheme } = useContext(LecketContext);

  const downloadRevenueData = () => {
    setLoading(true);
    let filter = "";
    let url = compileQuery(
      {},
      API_URL + "/finance/revenue",
      [
        "date",
        "amount",
        "rev_type",
        "id",
        "description",
        "customer_name",
        "confirmed",
        "confirmed_on",
        "confirmed_by",
      ],
      [{ by: "asc", attr: "date" }],
      "Lecket::Finance::Revenue",
      null,
      filter,
      null
    );
    url += "&download_as=true";

    fetch(url, {
      dataType: "blob",
      headers: {
        Accept: "application/json",
        Authorization: `token ${userData.auth_token}`,
        UserProfile: userData.profile,
        UserKey: userData.UserKey,
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => {
        return response.blob();
      })
      .then((result) => {
        let windowUrl = window.URL || window.webkitURL;
        let url = windowUrl.createObjectURL(result);
        let anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "revenue.xls";
        anchor.click();
        if (anchor.parentNode) anchor.parentNode.removeChild(anchor);
        windowUrl.revokeObjectURL(url);
      })
      .catch((e) => alert("Could not download sheet"));

    setLoading(false);
  };

  return (
    <DashboardLayout userData={userData}>
      <Head>
        <meta description="viewport" content="width=device-width" />
        <title>Revenue | Lecket</title>
      </Head>
      <div className={`${styles.view_edit} ${appTheme}`}>
        <div className={styles.header}>
          <h1 className={styles.name}>Revenue</h1>
          <button
            className={styles.back}
            style={{
              backgroundImage: `radial-gradient(
              100% 100% at 100% 0,
              rgb(17, 173, 95) 0,
              rgb(11, 138, 49) 100%
            )`,
            }}
            onClick={downloadRevenueData}
            disabled={loading}
          >
            Download <DownloadIcon style={{ fontSize: "13px" }} />
          </button>
          {/* <Link href={`/`} passHref>
            <button className={styles.back}>Back</button>
          </Link> */}
        </div>

        <RevenueTable userData={userData} />
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps({ req }) {
  const userData = isLoggedIn(req);
  if (userData) {
    // check if the user accessing this route has the right permission
    if (userData.user_type === FINANCE) {
      return {
        props: {
          userData,
        },
      };
    } else {
      // redirect to 403 page
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
