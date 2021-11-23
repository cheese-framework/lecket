import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import { API_URL } from "@/config/index";
import styles from "@/styles/UpgradeCard.module.css";

export default function UpgradeCard({ userData, id, cancel }) {
  const [packages, setPackages] = useState([]);
  const [price, setPrice] = useState(0);
  const [value, setValue] = useState("bar code");

  const loadPackages = async () => {
    try {
      const response = await Axios.get(
        `${API_URL}/afrijula/afrijula/packages`,
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
      const versions = [];
      let i = 0;
      for (let [key, value] of Object.entries(response.data)) {
        versions.push({ value: key, label: key.replace("_", " ") });
      }

      setPackages({ versions, prices: response.data });
      setPrice(getPrice(response.data.bar_code.price.cents));
    } catch (err) {
      console.log(err);
    }
  };

  const getPrice = (price) => {
    return Number(price) / 100;
  };

  const upgradePackages = async (e) => {
    e.preventDefault();
    try {
      // const response = await Axios.
    } catch (err) {}
  };

  useEffect(() => {
    loadPackages();
  }, []);

  return (
    <div className={styles.body}>
      <form autoComplete="off" onSubmit={upgradePackages}>
        <div>
          <select
            className={styles.select}
            onChange={(e) => {
              const val = e.target.value;
              const priceOfVal = getPrice(packages.prices[val].price.cents);
              setValue(val);
              setPrice(priceOfVal);
            }}
            value={value}
            required
          >
            {packages.versions &&
              packages.versions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        </div>
        <p className={styles.text}>D{price.toFixed(2)} per month</p>
        <button type="submit" className={styles.btn_save} title="Save">
          UPGRADE
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
