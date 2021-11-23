import { useState } from "react";
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
import Async from "react-select/async";
import { API_URL, FINANCE } from "@/config/index";
import Axios from "axios";
import { isLoggedIn } from "@/utils/utils";
import styles from "@/styles/Buttons.module.css";

export default function AddUser({ id, userData }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [type, setType] = useState("cashier");
  const [location, setLocation] = useState("");

  const addUser = async (e) => {
    e.preventDefault();
    try {
      if (name && lastName && address && email && number && type && location) {
        const response = await Axios.post(
          `${API_URL}/account/users`,
          {
            email,
            password,
            user_type: type,
            org_id: id,
            auto_gen: true,
            for_account: true,
            first_name: name,
            phone: number,
            last_name: lastName,
            influence: "InSIST",
            status: "activate",
            location,
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
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Could not add user",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const locationsOptions = async (name) => {
    const url =
      API_URL +
      '/afrijula/locations/location?attrs=["name"]&model=Afrijula::Locations::Location&unique=name&match=' +
      name;
    try {
      const response = await fetch(url, {
        dataType: "json",
        headers: {
          Accept: "application/json",
          Authorization: `token ${userData.auth_token}`,
          UserProfile: userData.profile,
          UserKey: userData.UserKey,
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      const json = await response.json();
      let opts = [];
      let i = 0;

      for (; i < json.length; i++) {
        opts[i] = { label: json[i], value: json[i] };
      }
      return opts;
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Could not fetch locations",
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
          <title>Add User | Lecket</title>
        </Head>
        <Container
          maxWidth="md"
          style={{
            padding: "30px",
            backgroundColor: "white",
            margin: "40px auto",
            borderRadius: "5px",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Add User
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
                <Async
                  loadOptions={locationsOptions}
                  defaultOptions
                  cacheOptions
                  placeholder="Locations"
                  name="location"
                  id="location"
                  onChange={(opt) => {
                    setLocation(opt.label);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="partner_type">User Type</InputLabel>
                  <Select
                    labelId="type"
                    id="type"
                    label="User Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <MenuItem value={"cashier"}>Cashier</MenuItem>
                    <MenuItem value={"admin"}>Admin</MenuItem>
                    <MenuItem value={"store manager"}>Store Manager</MenuItem>
                    <MenuItem value={"accountant"}>Accountant</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12}>
                <Button type="submit" className={styles.btn_success}>
                  Add User
                </Button>
                <Link href={`/organizations/${id}`} passHref>
                  <Button className={styles.btn_danger}>Cancel</Button>
                </Link>
              </Grid>
            </Grid>
          </form>
        </Container>
      </DashboardLayout>
    </>
  );
}

export async function getServerSideProps({ query: { id }, req }) {
  const userData = isLoggedIn(req);
  if (id && userData) {
    if (userData.user_type !== FINANCE) {
      return {
        props: {
          id,
          userData,
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
