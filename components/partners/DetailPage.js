import useRouter from "next/router";
import Head from "next/head";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import styles from "@/styles/DetailPage.module.css";
import Edit from "@mui/icons-material/Edit";

export default function DetailPage({ data, id, userData, theme }) {
  return (
    <DashboardLayout userData={userData}>
      <Head>
        <meta description="viewport" content="width=device-width" />
        <title>{data.name} | Lecket</title>
      </Head>
      <div className={`${styles.view_edit} ${theme}`}>
        <div className={styles.header}>
          <h1 className={styles.name}>General Information</h1>
          <Link href={`/partners/edit/${id}`} passHref>
            <p className={styles.edit}>
              <Edit style={{ fill: "#483d8b" }} />
            </p>
          </Link>

          <Link href="/partners" passHref>
            <button className={`${styles.back} button`}>Back</button>
          </Link>
        </div>
        <div className={styles.main}>
          <div className={styles.details}>
            <p className={styles.head}>Name: </p>
            <p className={styles.body}>{data.name}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Address: </p>
            <p className={styles.body}>{data.address}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Phone: </p>
            <p className={styles.body}>{data.contact_number}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Email: </p>
            <p className={styles.body}>{data.contact_email}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Access: </p>
            <p className={styles.body}>{data.access}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Website: </p>
            <p className={styles.body}>{data.website}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Contact Person: </p>
            <p className={styles.body}>{data.contact_person}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Status: </p>
            <p className={styles.body}>{data.status}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Partner Type: </p>
            <p className={styles.body}>{data.partner_type}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Region: </p>
            <p className={styles.body}>{data.lga}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
