import { useState, useContext } from "react";
import Link from "next/link";
import Head from "next/head";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Select, InputLabel, MenuItem, FormControl } from "@mui/material";
import DashboardLayout from "@/components/DashboardLayout";
import Swal from "sweetalert2";
import { API_URL, ADMIN } from "@/config/index";
import Axios from "axios";
import { isLoggedIn } from "@/utils/utils";
import styles from "@/styles/Buttons.module.css";
import LecketContext from "@/context/LecketContext";

export default function AddUser({ userData }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("admin");
  const { appTheme } = useContext(LecketContext);

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("user_type", type);
      formData.append("org_id", "");
      formData.append("auto_gen", true);
      formData.append("for_account", true);
      formData.append("first_name", name);
      formData.append("phone", number);
      formData.append("last_name", lastName);
      formData.append("influence", "InSIST");
      formData.append("status", "activate");

      if (name && lastName && address && email && number && type && location) {
        const response = await Axios.post(
          `${API_URL}/account/users/`,
          formData,
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
            title: "Success!",
            text: "User has been created",
            icon: "success",
            confirmButtonText: "Great",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Something went wrong. Could not add user",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        Swal.fire({
          title: "Warning",
          text: "All fields are required",
          icon: "warning",
          confirmButtonText: "Oops! :(",
        });
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Error!",
        text: "Could not add user",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <DashboardLayout userData={userData}>
        <Head>
          <meta description="viewport" content="width=device-width" />
          <title>Add Admin | Lecket</title>
        </Head>
        <Container
          maxWidth="md"
          style={{
            padding: "30px",
            backgroundColor: "white",
            margin: "40px auto",
            borderRadius: "5px",
          }}
          className={appTheme}
        >
          <Typography variant="h4" gutterBottom>
            Add Admin
          </Typography>
          <form autoComplete="off" onSubmit={addUser}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="first"
                  name="first"
                  label="First name"
                  fullWidth
                  variant="standard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="last"
                  name="last"
                  label="Last name"
                  fullWidth
                  variant="standard"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="address"
                  name="address"
                  label="Address"
                  fullWidth
                  variant="standard"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  fullWidth
                  variant="standard"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="standard"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="number"
                  name="number"
                  label="Telephone"
                  fullWidth
                  variant="standard"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="partner_type">Admin Type</InputLabel>
                  <Select
                    labelId="type"
                    id="type"
                    label="Admin Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <MenuItem value={"admin"}>Admin</MenuItem>
                    <MenuItem value={"finance"}>Finance</MenuItem>
                    <MenuItem value={"support"}>Support</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12}>
                <Button type="submit" className={styles.btn_success}>
                  SAVE
                </Button>
                <Link href={`/`} passHref>
                  <Button className={styles.btn_danger}>CANCEL</Button>
                </Link>
              </Grid>
            </Grid>
          </form>
        </Container>
      </DashboardLayout>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const userData = isLoggedIn(req);
  if (userData) {
    // check if the user accessing this route has the right permission
    if (userData.user_type === ADMIN) {
      return {
        props: {
          userData,
        },
      };
    } else {
      // redirect to 403 page
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
