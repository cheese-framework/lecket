import { useEffect, useState } from "react";
import { API_URL } from "@/config/index";
import { loadBilling } from "@/utils/utils";
import Axios from "axios";
import styles from "@/styles/DetailPage.module.css";

export default function SettingsPage({ userData, id }) {
  const [data, setData] = useState([]);

  const loadSettings = async () => {
    try {
      const response = await Axios.get(`${API_URL}/account/settings/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `token ${userData.auth_token}`,
          UserProfile: userData.profile,
          UserKey: userData.UserKey,
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      if (response.data) {
        setData(response.data[0]);
      }
    } catch (err) {
      // Swal.fire({
      //   title: "Success",
      //   text: "Organization status has been updated",
      //   icon: "success",
      //   confirmButtonText: "Great!",
      // });
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <div className={styles.main_settings}>
      <div className={styles.details}>
        <p className={styles.head}>Package: </p>
        <p className={styles.body}>{data.package}</p>
      </div>
      <div className={styles.details}>
        <p className={styles.head}>Number of users: </p>
        <p className={styles.body}>{data.metrics && data.metrics.users}</p>
      </div>
      <div className={styles.details}>
        <p className={styles.head}>Allowed users: </p>
        <p className={styles.body}>{data.metrics && data.metrics.active}</p>
      </div>
      <div className={styles.details}>
        <p className={styles.head}>Number of transactions: </p>
        <p className={styles.body}>{data.metrics && data.metrics.tran_count}</p>
      </div>
      <div className={styles.details}>
        <p className={styles.head}>Allowed transactions: </p>
        <p className={styles.body}>
          {data.metrics && data.metrics.package.max_sales === 0
            ? "Unlimited"
            : data.metrics && data.metrics.package.max_sales}
        </p>
      </div>
      <div className={styles.details}>
        <p className={styles.head}>Low stock threshold: </p>
        <p className={styles.body}>{data.low_stock_level}</p>
      </div>
      <div className={styles.details}>
        <p className={styles.head}>Notification: </p>
        <p className={styles.body}>{data.enable_notifications}</p>
      </div>
      <div className={styles.details}>
        <p className={styles.head}>Balance: </p>
        <p className={styles.body}>{data.balance}</p>
      </div>
      <div className={styles.details}>
        <p className={styles.head}>Term: </p>
        <p className={styles.body}>{data.term}</p>
      </div>
      <div className={styles.details}>
        <p className={styles.head}>Currency: </p>
        <p className={styles.body}>{data.default_currency}</p>
      </div>
      <div className={styles.details}>
        <p className={styles.head}>Locale: </p>
        <p className={styles.body}>{data.locale}</p>
      </div>
      <div className={styles.details}>
        <p className={styles.head}>Printer type: </p>
        <p className={styles.body}>{data.printer_type}</p>
      </div>
      <div className={styles.details}>
        <p className={styles.head}>VAT: </p>
        <p className={styles.body}>{data.tax_percentage}</p>
      </div>
    </div>
  );
}
