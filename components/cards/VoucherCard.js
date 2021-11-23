import { useState, useContext } from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import { API_URL } from "@/config/index";
import styles from "@/styles/VoucherCard.module.css";
import LecketContext from "@/context/LecketContext";

export default function VoucherCard({ cancel, id, userData }) {
  const [voucher, setVoucher] = useState("");
  const { appTheme } = useContext(LecketContext);

  const redeemVoucher = async (e) => {
    e.preventDefault();
    if (voucher) {
      if (confirm("Are you sure you want to redeem this voucher?")) {
        try {
          const response = await Axios.put(
            `${API_URL}/kodo/vouchers/vouchers/${voucher}`,
            {
              org_id: id,
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
            Swal.fire({
              title: "Success",
              text: "Voucher has been redeemed successfully.",
              icon: "success",
              confirmButtonText: "Cool",
            });
            cancel();
          } else {
            Swal.fire({
              title: "Error",
              text: "This voucher is not valid. Hence cannot be redeemed.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } catch (err) {
          Swal.fire({
            title: "Error",
            text: "Voucher is not valid",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    } else {
      Swal.fire({
        title: "Error",
        text: "Please enter a valid Voucher",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className={`${styles.body} ${appTheme}`}>
      <form autoComplete="off" onSubmit={redeemVoucher}>
        <input
          type="text"
          className={styles.text}
          placeholder="Enter Voucher Code"
          title="Voucher Goes Here"
          value={voucher}
          onChange={(e) => setVoucher(e.target.value)}
        />
        <button type="submit" className={styles.btn_save} title="Save">
          SAVE
        </button>
        <button
          type="submit"
          className={styles.btn_cancel}
          title="Cancel"
          onClick={cancel}
        >
          CANCEL
        </button>
      </form>
    </div>
  );
}
