import { useContext } from "react";
import { isLoggedIn } from "@/utils/utils";
import Head from "next/head";
import Link from "next/link";
import DownloadIcon from "@mui/icons-material/Download";
import DashboardLayout from "@/components/DashboardLayout";
import CashDeliveryTable from "@/components/finance/CashDeliveryTable";
import styles from "@/styles/DetailPage.module.css";
import { API_URL, compileQuery, FINANCE } from "@/config/index";
import LecketContext from "@/context/LecketContext";

export default function CashDelivery({ userData }) {
  const { appTheme } = useContext(LecketContext);

  const downloadCashDeliveryData = () => {
    let query = {};
    let filter =
      "'$or': [{merchant_status:{'$eq': 'picked up'}},{merchant_status:{'$eq': 'delivered'}},{merchant_status:{'$eq':'delivery failed'}},{merchant_status:{'$eq':'completed'}}],payment_method: {'$eq':'Cash on Delivery'},payment_settled:{'$eq': false}";

    let url = compileQuery(
      query,
      API_URL + "/finance/revenue",
      [
        "order_amount",
        "shipping_cost",
        "id",
        "currency",
        "shipping_method",
        "customer_name",
        "merchant_status",
        "shop_order_id",
      ],
      [{ by: "desc", attr: "date" }],
      "Afrijula::Shop::Order",
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
      .catch((err) => alert("Could not download file"));
  };

  return (
    <DashboardLayout userData={userData}>
      <Head>
        <meta description="viewport" content="width=device-width" />
        <title>Cash Delivery | Lecket</title>
      </Head>
      <div className={`${styles.view_edit} ${appTheme}`}>
        <div className={styles.header}>
          <h1 className={styles.name}>Cash with delivery company</h1>
          <button
            className={styles.back}
            style={{
              backgroundImage: `radial-gradient(
              100% 100% at 100% 0,
              rgb(17, 173, 95) 0,
              rgb(11, 138, 49) 100%
            )`,
            }}
            onClick={downloadCashDeliveryData}
            // disabled={loading}
          >
            Download <DownloadIcon style={{ fontSize: "13px" }} />
          </button>
          {/* <Link href={`/`} passHref>
            <button className={styles.back}>Back</button>
          </Link> */}
        </div>

        <CashDeliveryTable userData={userData} />
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
