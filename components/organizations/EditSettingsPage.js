import { useState, useEffect, useContext } from "react";
import useRouter from "next/router";
import Head from "next/head";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import styles from "@/styles/DetailPage.module.css";
import { INTERNAL_API_URL, API_URL } from "@/config/index";
import Axios from "axios";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";
import LecketContext from "@/context/LecketContext";

export default function EditSettingsPage({ id, userData }) {
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState("");
  const [stockThreshold, setStockThreshold] = useState("");
  const [enableNotification, setEnableNotification] = useState(false);
  const [currency, setCurrency] = useState("");
  const [printer, setPrinter] = useState("");
  const [vat, setVat] = useState(0);

  const { appTheme } = useContext(LecketContext);

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
        const data = response.data[0];
        setLocale(data.locale);
        setStockThreshold(data.low_stock_level);
        setEnableNotification(data.enable_notification);
        setCurrency(data.default_currency);
        setPrinter(data.printer_type);
        setTax(data.tax_percentage);
      }
    } catch (err) {}
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateOrganizationSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Axios.put(
        `${API_URL}/account/settings/${id}`,
        {
          printer_type: printer,
          enable_notification: enableNotification,
          default_currency: currency,
          locale,
          low_stock_level: stockThreshold,
          tax_percentage: vat,
          org_id: id,
        },
        {
          Accept: "application/json",
          Authorization: `token ${userData.auth_token}`,
          UserProfile: userData.profile,
          UserKey: userData.UserKey,
          "X-Requested-With": "XMLHttpRequest",
        }
      );
      if (response.data) {
        Swal.fire({
          title: "Settings updated",
          text: "Settings have been updated successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        useRouter.push(`/organizations/${id}`);
      } else {
        Swal.fire({
          title: "Error",
          text: "An error occured while updating the organization settings",
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
        text: "An error occured while updating the organization settings",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    setLoading(false);
  };

  return (
    <DashboardLayout userData={userData}>
      <Head>
        <meta description="viewport" content="width=device-width" />
        <title>Update Settings | Lecket</title>
      </Head>
      <div className={`${styles.view_edit} ${appTheme}`}>
        <div className={styles.header}>
          <h1 className={styles.name}>Edit Settings</h1>

          <Link href={`/organizations/${id}`} passHref>
            <button className={styles.back_edit}>Cancel</button>
          </Link>
        </div>
        <form className={styles.main} onSubmit={updateOrganizationSettings}>
          <div className={styles.details}>
            <p className={styles.head}>Locale: </p>
            <select
              className={styles.select}
              defaultValue={locale || ""}
              onChange={(e) => setLocale(e.target.value)}
            >
              <option value={"en" || "en-US"}>English</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Low Stock Threshold: </p>
            <input
              className={styles.input}
              value={stockThreshold || ""}
              onChange={(e) => setStockThreshold(e.target.value)}
            />
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Currency: </p>
            <select
              className={styles.select}
              defaultValue={currency || ""}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="GMD">Gambia - GMD</option>
              <option value="CFA">Senegal - CFA</option>
            </select>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Printer Type: </p>
            <select
              className={styles.select}
              defaultValue={printer || ""}
              onChange={(e) => setPrinter(e.target.value)}
            >
              <option value="a4">A4</option>
              <option value="thermal">Thermal Paper</option>
            </select>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>VAT: </p>
            <input
              className={styles.input}
              value={vat || ""}
              onChange={(e) => setVat(e.target.value)}
            />
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Enable Notification: </p>
            <input
              type="checkbox"
              className={styles.form_check}
              checked={enableNotification || false}
              value={enableNotification || false}
              onChange={(e) => setEnableNotification(e.target.checked)}
            />
          </div>
          <div className={styles.save}>
            {loading ? <Loader /> : null}
            <input
              className={styles.button}
              type="submit"
              value="Save"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
