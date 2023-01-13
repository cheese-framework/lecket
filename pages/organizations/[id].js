import { useState, useContext } from "react";
import { isLoggedIn } from "@/utils/utils";
import { INTERNAL_API_URL } from "@/config/index";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import DetailPage from "@/components/organizations/DetailPage";
import SettingsPage from "@/components/organizations/SettingsPage";
import styles from "@/styles/DetailPage.module.css";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import NoteIcon from "@mui/icons-material/Note";
import Axios from "axios";
import Swal from "sweetalert2";
import { API_URL, FINANCE } from "@/config/index";
import LecketContext from "@/context/LecketContext";
import ClearDataCard from "@/components/cards/ClearDataCard";

export default function OrganizationDetails({
  organization,
  id,
  userData,
  page,
}) {
  const [view, setView] = useState("details");
  const [showClearData, setShowClearData] = useState(false);
  const { appTheme } = useContext(LecketContext);
  const router = useRouter();

  const deleteOrganization = async () => {
    try {
      const response = await Axios.put(
        `${API_URL}/organizations_v2/${id}`,
        {
          status: "deleted",
        },
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
      if (response.status === 200 || response.status === 204) {
        Swal.fire({
          title: "Success",
          text: "Organization has been deleted",
          icon: "success",
          confirmButtonText: "Great!",
        });
        router.push(`/organizations`);
      } else {
        Swal.fire({
          title: "Error",
          text: "Could not delete this organization",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.log(err);
      }
      Swal.fire({
        title: "Error",
        text: "Could not delete organization",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <DashboardLayout userData={userData}>
      <Head>
        <meta description="viewport" content="width=device-width" />
        <title>{organization.name} | Lecket</title>
      </Head>
      <div className={`${styles.view_edit} ${appTheme}`}>
        <div className={styles.header}>
          <h1 className={styles.name}>
            {view === "settings" ? "Settings" : "General Information"}
          </h1>
          <p
            className={styles.edit}
            onClick={() => setShowClearData(!showClearData)}
          >
            <DeleteSweepIcon style={{ fill: "#2e8b57" }} />
          </p>
          <p
            className={styles.edit}
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to delete this organization. All related records will be wiped out."
                )
              ) {
                deleteOrganization();
              }
            }}
            title="Delete Organization"
          >
            <Delete style={{ fill: "#ce2029" }} />
          </p>
          <Link
            href={
              view === "details"
                ? `/organizations/edit/${id}`
                : `/organizations/settings/${id}`
            }
            passHref
          >
            <p
              className={styles.edit}
              title={view === "details" ? "Edit Organization" : "Edit Settings"}
            >
              <Edit style={{ fill: "#483d8b" }} />
            </p>
          </Link>

          <p
            className={styles.edit}
            onClick={() => {
              if (view === "settings") {
                setView("details");
              } else {
                setView("settings");
              }
            }}
          >
            {view === "settings" ? (
              <NoteIcon style={{ fill: "#008080" }} />
            ) : (
              <SettingsIcon style={{ fill: "#008080" }} />
            )}
          </p>
          {/* <Link href={`/organizations`} passHref> */}
          <Link href={`/organizations?page=${page}`} passHref>
            <button className={`${styles.back} button`}>Back</button>
            {/* <button className={`${styles.back} button`} onClick={() => router.back()}>Back</button> */}
          </Link>
        </div>
        {showClearData && (
          <ClearDataCard
            theme={appTheme}
            setShowClearData={setShowClearData}
            userData={userData}
            id={id}
          />
        )}
        {view === "settings" ? (
          <SettingsPage data={organization} id={id} userData={userData} />
        ) : (
          <DetailPage data={organization} id={id} userData={userData} />
        )}
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps({ query: { id, che }, req }) {
  //lastPage, che
  console.log("details: ", che); //lastPage ,che
  const userData = isLoggedIn(req);
  let organization = [];
  let page = null; //null, 0
  if (userData) {
    if (userData.user_type !== FINANCE) {
      try {
        const response = await Axios.post(`/api/organizations/get`, {
          userData,
          id,
        });
        page = Number(che); //Number(lastPage), che
        organization = response.data;
      } catch (err) {
        console.log(err);
      }
      return {
        props: {
          organization,
          userData,
          id,
          page,
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
