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
import cookie from "cookie";
import { INTERNAL_API_URL, FINANCE } from "@/config/index";
import Axios from "axios";
import styles from "@/styles/Buttons.module.css";
import Loader from "@/components/Loader";
import LecketContext from "@/context/LecketContext";

export default function AddPartner({ userData }) {
  const [name, setName] = useState("");
  const [person, setPerson] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [access, setAccess] = useState("afrijula");
  const [type, setType] = useState("strategic");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);

  const { appTheme } = useContext(LecketContext);

  const addPartner = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (name && person && email && number && access && type && status) {
      try {
        const response = await Axios.post(
          `${INTERNAL_API_URL}/api/partners/add`,
          { name, person, email, number, access, type, status, userData }
        );
        if (response.status === 200) {
          clearForm();
          Swal.fire({
            title: "Success!",
            text: "Partner has been added",
            icon: "success",
            confirmButtonText: "Great",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "An error occurred while adding partner.",
            icon: "error",
            confirmButtonText: "Oops! :(",
          });
        }
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "An error occurred while adding partner.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      Swal.fire({
        title: "Error!",
        text: "Al fields are required",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
    setLoading(false);
  };

  const clearForm = () => {
    setName("");
    setPerson("");
    setEmail("");
    setNumber("");
  };

  return (
    <>
      <DashboardLayout userData={userData}>
        <Head>
          <meta description="viewport" content="width=device-width" />
          <title>Add Partner | Lecket</title>
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
            Add Partner
          </Typography>
          <form autoComplete="off" onSubmit={addPartner}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="name"
                  name="name"
                  label="Partner name"
                  fullWidth
                  variant="standard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="contact_person"
                  name="contact_person"
                  label="Contact person"
                  fullWidth
                  variant="standard"
                  value={person}
                  onChange={(e) => setPerson(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="email"
                  name="email"
                  label="Contact Email"
                  fullWidth
                  variant="standard"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="number"
                  name="number"
                  label="Contact Number"
                  fullWidth
                  variant="standard"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="access">Access</InputLabel>
                  <Select
                    labelId="access"
                    id="access"
                    label="Access"
                    value={access}
                    onChange={(e) => setAccess(e.target.value)}
                  >
                    <MenuItem value={"afrijula"}>Afrijula</MenuItem>
                    <MenuItem value={"jangal"}>Jangal</MenuItem>
                    <MenuItem value={"kodo"}>Kodo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="partner_type">Partner Type</InputLabel>
                  <Select
                    labelId="partner_type"
                    id="partner_type"
                    label="Partner Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <MenuItem value={"strategic"}>Strategic</MenuItem>
                    <MenuItem value={"paid"}>Paid</MenuItem>
                    <MenuItem value={"fsp"}>FSP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="status">Status</InputLabel>
                  <Select
                    labelId="status"
                    id="status"
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value={"active"}>Active</MenuItem>
                    <MenuItem value={"inactve"}>Inactve</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                {loading ? <Loader /> : null}
                <Button
                  type="submit"
                  className={`${styles.btn_success} button`}
                  disabled={loading}
                >
                  Add Partner
                </Button>
                <Link href="/partners" passHref>
                  <Button className={`${styles.btn_danger} button`}>
                    Cancel
                  </Button>
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
  const cookies = cookie.parse(req.headers.cookie || "");
  if (cookies && cookies.user) {
    const userData = JSON.parse(cookies.user);
    if (userData.user_type !== FINANCE) {
      return {
        props: {
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
