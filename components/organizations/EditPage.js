import { useState, useContext } from "react";
import useRouter from "next/router";
import Head from "next/head";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import styles from "@/styles/DetailPage.module.css";
import { INTERNAL_API_URL } from "@/config/index";
import Axios from "axios";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";
import LecketContext from "@/context/LecketContext";

export default function EditPage({ data, id, userData }) {
  const [name, setName] = useState(data.name);
  const [address, setAddress] = useState(data.address);
  const [phone, setPhone] = useState(data.contact_number);
  const [email, setEmail] = useState(data.contact_email);
  const [website, setWebsite] = useState(data.website);
  const [person, setPerson] = useState(data.contact_person);
  const [gender, setGender] = useState(data.owner_gender);
  const [age, setAge] = useState(data.owner_age);
  const [type, setType] = useState(data.business_type);
  const [lga, setLga] = useState(data.lga);

  const [loading, setLoading] = useState(false);

  const { appTheme } = useContext(LecketContext);

  const updateOrganization = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Axios.post(`/api/organizations/update`, {
        id,
        userData,
        data: {
          name,
          address,
          contact_number: phone,
          email,
          website,
          owner_gender: gender,
          owner_age: age,
          business_type: type,
          lga,
        },
      });
      if (response.data) {
        Swal.fire({
          title: "Success",
          text: "Organization updated",
          icon: "success",
          confirmButtonText: "Cool",
        });

        useRouter.push(`/organizations/${id}`);
      } else {
        Swal.fire({
          title: "Error",
          text: "Could not update organization",
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
        text: "An error occured while updating the organization",
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
        <title>Update {data.name} | Lecket</title>
      </Head>
      <div className={`${styles.view_edit} ${appTheme}`}>
        <div className={styles.header}>
          <h1 className={styles.name}>Edit Information</h1>

          <Link href={`/organizations/${id}`} passHref>
            <button className={styles.back_edit}>Cancel</button>
          </Link>
        </div>
        <form className={styles.main} onSubmit={updateOrganization}>
          <div className={styles.details}>
            <p className={styles.head}>Name: </p>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Address: </p>
            <input
              className={styles.input}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Phone: </p>
            <input
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Email: </p>
            <input
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Website: </p>
            <input
              className={styles.input}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Contact Person: </p>
            <input
              className={styles.input}
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              required
            />
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Owner&apos;s Gender: </p>
            <select
              className={styles.select}
              defaultValue={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Owner&apos;s Age: </p>
            <select
              className={styles.select}
              defaultValue={age}
              onChange={(e) => setAge(e.target.value)}
              required
            >
              <option value="15-24">15-24</option>
              <option value="25-35">25-35</option>
              <option value="Over 35">Over 35</option>
            </select>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Business Type: </p>
            <select
              className={styles.select}
              defaultValue={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="MSME">MSME</option>
              <option value="Large Corporation">Large Corporation</option>
            </select>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Region: </p>
            <select
              className={styles.select}
              defaultValue={lga}
              onChange={(e) => setLga(e.target.value)}
              required
            >
              <option value="BJL">BJL</option>
              <option value="CRR">CRR</option>
              <option value="KMC">KMC</option>
              <option value="LRR">LRR</option>
              <option value="NBR">NBR</option>
            </select>
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
