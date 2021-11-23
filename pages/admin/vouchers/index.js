import { useState, useContext } from "react";
import { isLoggedIn } from "@/utils/utils";
import Head from "next/head";
import DashboardLayout from "@/components/DashboardLayout";
import VouchersTable from "@/components/vouchers/VouchersTable";
import VoucherBatchCard from "@/components/vouchers/VoucherBatchCard";
import LecketContext from "@/context/LecketContext";
import styles from "@/styles/DetailPage.module.css";
import { ADMIN } from "@/config/index";

export default function Vouchers({ userData }) {
  const [showBatchForm, setShowBatchForm] = useState(false);
  const { appTheme } = useContext(LecketContext);

  return (
    <DashboardLayout userData={userData}>
      <Head>
        <meta description="viewport" content="width=device-width" />
        <title>Manage Vouchers | Lecket</title>
      </Head>
      <div className={`${styles.view_edit} ${appTheme}`}>
        <div className={styles.header}>
          <h1 className={styles.name}>Manage Vouchers</h1>
          <button
            className={styles.back}
            style={{ backgroundColor: "#3cb371" }}
            onClick={() => setShowBatchForm(!showBatchForm)}
          >
            {showBatchForm ? "Hide Form" : "Add Batch"}
          </button>
          {/* <Link href={`/`} passHref>
            <button className={styles.back}>Back</button>
          </Link> */}
        </div>

        {showBatchForm ? (
          <VoucherBatchCard
            userData={userData}
            cancel={() => setShowBatchForm(false)}
          />
        ) : null}
        <VouchersTable userData={userData} />
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps({ req }) {
  const userData = isLoggedIn(req);
  if (userData) {
    // check if the user accessing this route has the right permission
    if (userData.user_type === ADMIN) {
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
