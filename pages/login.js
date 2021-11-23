import { useState } from "react";
import { isLoggedIn } from "@/utils/utils";
import useRouter from "next/router";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import Axios from "axios";
import cookie from "cookie";
import Loader from "@/components/Loader";
import styles from "@/styles/Login.module.css";

const Login = ({ user }) => {
  const [email, setEmail] = useState({
    value: user.email,
    hasError: false,
  });
  const [password, setPassword] = useState({
    value: user.password,
    hasError: false,
  });

  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (email.value.trim().length <= 0) {
      Swal.fire({
        title: "Error!",
        text: "Email field is required",
        icon: "error",
        confirmButtonText: "OK",
      });
      setEmail({ value: email.value, hasError: true });
    } else if (password.value.trim().length <= 0) {
      Swal.fire({
        title: "Error!",
        text: "Password field is required",
        icon: "error",
        confirmButtonText: "OK",
      });
      setPassword({ value: password.value, hasError: true });
    } else {
      // Login user
      const r = Math.random().toString(36);
      const influence = "InSIST";
      try {
        const res = await Axios.post("/api/login", {
          email: email.value,
          password: password.value,
          influence,
          r,
          remember,
        });
        if (res.data.success) {
          Swal.fire({
            title: "Success!",
            text: "Authenticated successfully",
            icon: "success",
            confirmButtonText: "Great!",
          });
          useRouter.push("/");
        } else {
          Swal.fire({
            title: "Error!",
            text: "Authentication error",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (e) {
        console.log(e);
        Swal.fire({
          title: "Error!",
          text: "Authentication error. Check your credentials or contact support.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Login | Lecket</title>
        <meta name="viewport" content="width=device-width" />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.section_auth}>
          <h3 className={styles.h3}>Login to Lecket</h3>
          <div className={styles.auth}>
            <div className={styles.login_form}>
              <form
                onSubmit={handleSubmit}
                autoComplete="off"
                className={styles.form}
              >
                <div className={styles.form__group}>
                  <input
                    id="email"
                    placeholder="Email Address"
                    name="email"
                    type="email"
                    onChange={(e) =>
                      setEmail({ value: e.target.value, hasError: false })
                    }
                    value={email.value}
                    className={styles.form__input}
                  />
                  <label htmlFor="email" className={styles.form__label}>
                    Email Address
                  </label>
                </div>
                <div className={styles.form__group}>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={(e) =>
                      setPassword({ value: e.target.value, hasError: false })
                    }
                    value={password.value}
                    className={styles.form__input}
                  />
                  <label htmlFor="password" className={styles.form__label}>
                    Password
                  </label>
                </div>
                <div className={styles.form__group}>
                  <label htmlFor="remember" className={styles.form__label}>
                    Remember Me
                  </label>
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    className={styles.form_check}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                </div>
                <div className={`${styles.form_group} ${styles.center}`}>
                  <input
                    type="submit"
                    disabled={email.hasError || password.hasError || loading}
                    value="Sign in"
                    className={`${styles.submit}`}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        {loading ? <Loader /> : null}
      </div>
    </>
  );
};

export default Login;

export async function getServerSideProps({ req }) {
  if (!isLoggedIn(req)) {
    let user = { email: "", password: "" };
    // check if user has checked the remember me checkbox
    const cookies = cookie.parse(req.headers.cookie || "");
    if (cookies && cookies.remember_user) {
      const temp = JSON.parse(cookies.remember_user);
      user.email = temp.email;
      user.password = temp.password;
    }
    return {
      props: {
        user,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }
}
