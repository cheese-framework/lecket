import { useState, useEffect, useContext } from "react";
import { isLoggedIn } from "@/utils/utils";
import Head from "next/head";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import styles from "@/styles/DetailPage.module.css";
import Axios from "axios";
import TimeAgo from "javascript-time-ago";
import Loader from "@/components/Loader";
import en from "javascript-time-ago/locale/en";
import PasswordChangeCard from "@/components/cards/PasswordChangeCard";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LecketContext from "@/context/LecketContext";
import { API_URL } from "@/config/index";
import Swal from "sweetalert2";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function UserDetails({ userData, userid, id }) {
  // const timeAgo = new TimeAgo("en-US");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showPasswordView, setShowPasswordView] = useState(false);
  const [status, setStatus] = useState("activated");

  const { appTheme } = useContext(LecketContext);

  const updateData = async (data) => {
    if (confirm("Are you sure you want to change this user's status?")) {
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
    }
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

  const sendResetLink = async () => {
    if (confirm("Extra confirmation check. Are you sure?")) {
      setLoading(true);
      const email = data.email;
      const phone_number = data.phone_number;
      const r = Math.random().toString(36);
      try {
        const response = await Axios.post(
          `${API_URL}/account/authenticate_v2/reset`,
          {
            email,
            phone_number,
            influence: "afrijula",
            r,
            stage: 1,
          }
        );
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
  };

  const resendLink = async () => {
    if (confirm("Extra confirmation check. Are you sure?")) {
      setLoading(true);
      try {
        const response = await Axios.put(
          `${API_URL}/account/users/${userid}/resend_activate`,
          { influence: "InSIST" },
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
          text: "Link sent successfully.",
          confirmButtonText: "OK",
        });
      } catch (err) {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Could not resend activation link.",
          confirmButtonText: "OK",
        });
        console.log(err);
      }
      setLoading(false);
    }
  };

  useEffect(() => fetchData(), []);

  return (
    <DashboardLayout userData={userData}>
      <Head>
        <meta description="viewport" content="width=device-width" />
        <title>
          {data.first_name ? `${data.first_name} ${data.last_name}` : "..."} |
          Lecket
        </title>
      </Head>
      <div className={`${styles.view_edit} ${appTheme}`}>
        <div className={styles.header}>
          <h1 className={styles.name}>
            {data.first_name && `${data.first_name}'s`} Information
          </h1>

          <div>
            <button
              className={styles.back}
              style={{ backgroundColor: "#2e8b57" }}
              onClick={() => setShowPasswordView(!showPasswordView)}
            >
              Update Password
            </button>
            {showPasswordView && (
              <PasswordChangeCard
                cancel={() => setShowPasswordView(false)}
                userData={userData}
                userid={userid}
                theme={appTheme}
              />
            )}
          </div>
          {status === "activated" ? (
            <>
              <button
                className={styles.back}
                style={{ backgroundColor: "#2e8b57" }}
                onClick={sendResetLink}
              >
                Send Reset Link
              </button>
              <button
                className={styles.back}
                style={{ backgroundColor: "#b22222" }}
                onClick={() => updateData({ status: "blocked" })}
                disabled={processing}
              >
                Block User <LockIcon style={{ fontSize: "12px" }} />
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.back}
                style={{ backgroundColor: "#2e8b57" }}
                onClick={resendLink}
                disabled={processing}
              >
                Resend Activation Link
              </button>
              <button
                className={styles.back}
                style={{ backgroundColor: "#2e8b57" }}
                onClick={() => updateData({ status: "activated" })}
                disabled={processing}
              >
                Unblock User <LockOpenIcon style={{ fontSize: "12px" }} />
              </button>
            </>
          )}

          <Link href={`/organizations/${id}`} passHref>
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
