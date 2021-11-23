import { useState, useEffect } from "react";
import { isLoggedIn } from "@/utils/utils";
import Head from "next/head";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import styles from "@/styles/DetailPage.module.css";
import Axios from "axios";
import Loader from "@/components/Loader";
import { API_URL } from "@/config/index";
import Swal from "sweetalert2";

export default function UserDetails({ userData, userid, id }) {
  // const timeAgo = new TimeAgo("en-US");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showPasswordView, setShowPasswordView] = useState(false);
  const [status, setStatus] = useState("activated");

  const updateData = async (data) => {
    setProcessing(true);
    try {
      await Axios.put(
        `${API_URL}/account/users/${userid}`,
        {
          ...data,
        },
        {
          headers: {
            Authorization: `token ${userData.auth_token}`,
            UserProfile: userData.profile,
            UserKey: userData.UserKey,
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
      Swal.fire({
        title: "Success",
        icon: "success",
        text: "Updated successfully.",
        confirmButtonText: "Cool",
      });
      status === "blocked" ? setStatus("activated") : setStatus("blocked");
    } catch (err) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while updating data",
      });
    }
    setProcessing(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await Axios({
        url: `${API_URL}/account/users/${userid}`,
        method: "GET",
        headers: {
          Authorization: `token ${userData.auth_token}`,
          UserProfile: userData.profile,
          UserKey: userData.UserKey,
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      setData(res.data);
      setStatus(res.data.status);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => fetchData(), []);

  return (
    <DashboardLayout userData={userData}>
      <Head>
        <meta description="viewport" content="width=device-width" />
        <title>
          Update{" "}
          {data.first_name ? `${data.first_name} ${data.last_name}` : "..."} |
          Lecket
        </title>
      </Head>
      <div className={styles.view_edit}>
        <div className={styles.header}>
          <h1 className={styles.name}>{`${data.first_name}'s`} Information</h1>
          <Link href={`/organizations/users/${id}/${userid}`} passHref>
            <button className={styles.back}>Back</button>
          </Link>
        </div>
        {!loading ? (
          <>
            {/* <div className={styles.aside}>
              
            </div> */}
            <div className={styles.main}>
              <div className={styles.details}>
                <p className={styles.head}>FullName: </p>
                <p
                  className={styles.body}
                >{`${data.first_name} ${data.middle_names} ${data.last_name}`}</p>
              </div>
              <div className={styles.details}>
                <p className={styles.head}>Phone: </p>
                <p className={styles.body}>{data.phone_number}</p>
              </div>
              <div className={styles.details}>
                <p className={styles.head}>Email: </p>
                <p className={styles.body}>{data.email}</p>
              </div>
              <div className={styles.details}>
                <p className={styles.head}>Balance: </p>
                <p className={styles.body}>{data.account_balance}</p>
              </div>
              <div className={styles.details}>
                <p className={styles.head}>Status: </p>
                <p className={styles.body}>{status}</p>
              </div>
              <div className={styles.details}>
                <p className={styles.head}>Created: </p>
                <p className={styles.body}>
                  {data.created_at && timeAgo.format(new Date(data.created_at))}
                </p>
              </div>
              <div className={styles.details}>
                <p className={styles.head}>Last Updated: </p>
                <p className={styles.body}>
                  {data.updated_at && timeAgo.format(new Date(data.updated_at))}
                </p>
              </div>
              <div className={styles.details}>
                <p className={styles.head}>Last Activity: </p>
                <p className={styles.body}>
                  {data.last_login_date &&
                    timeAgo.format(new Date(data.last_login_date))}
                </p>
              </div>
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps({ query: { userid, id }, req }) {
  const userData = isLoggedIn(req);

  if (userData) {
    return {
      props: {
        userData,
        userid,
        id,
      },
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
