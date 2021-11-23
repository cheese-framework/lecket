import { useState, useContext } from "react";
import { API_URL } from "@/config/index";
import Axios from "axios";
import styles from "@/styles/PasswordCard.module.css";
import Swal from "sweetalert2";
import LecketContext from "@/context/LecketContext";

export default function VoucherBatchCard({ cancel, userData }) {
  const [count, setCount] = useState(1);
  const [value, setValue] = useState(0);

  const { appTheme } = useContext(LecketContext);

  const saveBatch = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post(
        `${API_URL}/kodo/vouchers/batch`,
        {
          number: count,
          amount: value,
          currency: "GMD",
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

      Swal.fire({
        title: "Success",
        text: "Voucher batch has been created successfully",
        icon: "success",
        preConfirm: () => cancel(),
        showLoaderOnConfirm: true,
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Error",
        text: "Could not create vouchers",
        icon: "error",
      });
    }
  };

  return (
    <div className={`${styles.body} ${appTheme}`}>
      <form autoComplete="off" onSubmit={saveBatch}>
        <label htmlFor="count">Count: </label>
        <input
          id="count"
          type="number"
          className={styles.text}
          placeholder="Count"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          min={1}
        />
        <label htmlFor="value">Value: </label>
        <input
          id="value"
          type="text"
          className={styles.text}
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" className={styles.btn_save} title="Save">
          SAVE
        </button>
        <button
          type="button"
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
