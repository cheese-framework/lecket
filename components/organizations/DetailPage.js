import { useState } from "react";
import Link from "next/link";
import VoucherCard from "@/components/cards/VoucherCard";
import UsersTable from "@/components/organizations/UsersTable";
import ChargesTable from "@/components/organizations/ChargesTable";
import PaymentsTable from "@/components/organizations/PaymentsTable";
import styles from "@/styles/DetailPage.module.css";
import Add from "@mui/icons-material/Add";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "@/config/index";

export default function DetailPage({ data, id, userData }) {
  const [status, setStatus] = useState(data.status || "active");
  const [showVoucherForm, setShowVoucherForm] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showCharges, setShowCharges] = useState(false);
  const [showPayments, setShowPayments] = useState(false);

  const changeStatus = async () => {
    try {
      const response = await Axios.put(
        `${API_URL}/organizations_v2/${id}`,
        {
          status: status === "active" ? "inactive" : "active",
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

      if (response.status === 200) {
        if (status === "inactive") {
          setStatus("active");
        } else {
          setStatus("inactive");
        }
        Swal.fire({
          title: "Success",
          text: "Organization status has been updated",
          icon: "success",
          confirmButtonText: "Great!",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Could not update this organization's status",
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
        text: "Could not update this organization's status",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <div className={styles.aside}>
        {showUsers && (
          <Link href={`/organizations/users/create/${id}`} passHref>
            <p className={styles.v_edit} title="Add User">
              <Add style={{ fill: "#008080" }} />
            </p>
          </Link>
        )}
        {!showUsers && (
          <div className={styles.v_edit} title="Add Voucher">
            <CreditCardIcon
              style={{ fill: "#5f9ea0", position: "relative" }}
              onClick={() => setShowVoucherForm(!showVoucherForm)}
            />

            {showVoucherForm ? (
              <VoucherCard
                cancel={() => setShowVoucherForm(!showVoucherForm)}
                id={id}
                userData={userData}
              />
            ) : null}
          </div>
        )}
        {!showUsers && (
          <button
            className={styles.vback}
            onClick={() => {
              if (
                confirm(
                  "Are your sure you want to change this subscriber's status?"
                )
              ) {
                changeStatus();
              }
            }}
            style={{ backgroundColor: "#483d8b" }}
            id="status"
          >
            {status === "active" ? "Deactivate" : "Activate"}
          </button>
        )}
        <button
          className={styles.vback}
          onClick={() => {
            setShowUsers(!showUsers);
            setShowCharges(false);
            setShowPayments(false);
          }}
          style={{ backgroundColor: "#3cb371" }}
        >
          {showUsers ? "Hide Users" : "Show Users"}
        </button>
        <button
          className={styles.vback}
          onClick={() => {
            setShowCharges(!showCharges);
          }}
          style={{ backgroundColor: "#5f9ea0" }}
        >
          {showCharges ? "Hide Charges" : "Show Charges"}
        </button>
        <button
          className={styles.vback}
          onClick={() => {
            setShowPayments(!showPayments);
          }}
          style={{ backgroundColor: "#5f9ea0" }}
        >
          {showPayments ? "Hide Payments" : "Show Payments"}
        </button>
      </div>
      {showPayments ? (
        <PaymentsTable id={id} userData={userData} />
      ) : !showUsers && !showCharges ? (
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
            <p className={styles.head}>Website: </p>
            <p className={styles.body}>{data.website}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Contact Person: </p>
            <p className={styles.body}>{data.contact_person}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Status: </p>
            <p className={styles.body}>{status}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Owner&apos;s Gender: </p>
            <p className={styles.body}>{data.owner_gender}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Owner&apos;s Age: </p>
            <p className={styles.body}>{data.owner_age}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Business Type: </p>
            <p className={styles.body}>{data.business_type}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Region: </p>
            <p className={styles.body}>{data.lga}</p>
          </div>
        </div>
      ) : showCharges ? (
        <ChargesTable id={id} userData={userData} />
      ) : (
        <UsersTable id={id} userData={userData} />
      )}
    </>
  );
}
