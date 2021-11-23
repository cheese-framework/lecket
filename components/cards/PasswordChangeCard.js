import { useState } from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import { API_URL } from "@/config/index";
import styles from "@/styles/PasswordCard.module.css";
import Loader from "@/components/Loader";

export default function PasswordChangeCard({
  cancel,
  userid,
  userData,
  theme,
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const isPasswordValid = () => {
    if (password && confirm && password === confirm) {
      return true;
    }
    return false;
  };

  const passwordChange = async (e) => {
    e.preventDefault();
    if (isPasswordValid()) {
      setLoading(true);
      try {
        await Axios.put(
          `${API_URL}/account/users/${userid}`,
          {
            new_password: password,
            confirm_password: confirm,
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
          text: "Password has been updated successfully.",
          confirmButtonText: "Cool",
          preConfirm: () => cancel(),
          showLoaderOnConfirm: true,
        });
      } catch (err) {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "An error occurred while updating the password",
          timer: 3400,
        });
      }
      setLoading(false);
    } else {
      Swal.fire({
        title: "Invalid Data Received",
        icon: "warning",
        text: "Enter valid passwords. Make sure both fields are filled and identical.",
      });
    }
  };

  return (
    <div className={`${styles.body} ${theme}`}>
      <form autoComplete="off" onSubmit={passwordChange}>
        <input
          type="password"
          className={styles.text}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className={styles.text}
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {loading && <Loader />}
        <button
          type="submit"
          className={styles.btn_save}
          title="Save"
          disabled={loading}
        >
          SAVE
        </button>
        <button
          type="button"
          className={styles.btn_cancel}
          title="Cancel"
          onClick={() => cancel()}
        >
          CANCEL
        </button>
      </form>
    </div>
  );
}
