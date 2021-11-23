import { useState, useContext } from "react";
import { isLoggedIn } from "@/utils/utils";
import Head from "next/head";
// import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import PendingClaimsTable from "@/components/finance/PendingClaimsTable";
import DownloadIcon from "@mui/icons-material/Download";
import styles from "@/styles/DetailPage.module.css";
import { API_URL, compileQuery, FINANCE } from "@/config/index";
import LecketContext from "@/context/LecketContext";

export default function PendingClaims({ userData }) {
  const [loading, setLoading] = useState(false);
  const { appTheme } = useContext(LecketContext);

  const downloadRevenueData = () => {
    setLoading(true);
    let filter =
      "'$or': [{request_status:{'$eq': 'sent'}},{transaction_complete:{'$eq': false}}]";

    let url = compileQuery(
      {},
      API_URL + "/finance/revenue",
      [
        "amount",
        "s_type",
        "id",
        "transaction_fee",
        "reference_number",
        "request_status",
        "account_name",
      ],
      [{ by: "desc", attr: "date" }],
      "Afrijula::Shop::Settlement",
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
        var windowUrl = window.URL || window.webkitURL;
        var url = windowUrl.createObjectURL(result);
        var anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "settlement_clams.xls";
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
        <title>Pending Claims | Lecket</title>
      </Head>
      <div className={`${styles.view_edit} ${appTheme}`}>
        <div className={styles.header}>
          <h1 className={styles.name}>Pending Claims</h1>
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

        <PendingClaimsTable userData={userData} />
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
