import { useState } from "react";
import useRouter from "next/router";
import Link from "next/link";
import Head from "next/head";
import DashboardLayout from "@/components/DashboardLayout";
import styles from "@/styles/DetailPage.module.css";
import { INTERNAL_API_URL } from "@/config/index";
import Axios from "axios";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";

export default function EditPage({ data, id, userData, theme }) {
  const [name, setName] = useState(data.name);
  const [address, setAddress] = useState(data.address);
  const [phone, setPhone] = useState(data.contact_number);
  const [email, setEmail] = useState(data.contact_email);
  const [website, setWebsite] = useState(data.website);
  const [person, setPerson] = useState(data.contact_person);
  const [access, setAccess] = useState(data.access);
  const [type, setType] = useState(data.partner_type);
  const [lga, setLga] = useState(data.lga);

  const [loading, setLoading] = useState(false);

  const updatePartner = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Axios.post(`/api/partners/update`, {
        id,
        userData,
        data: {
          name,
          address,
          contact_number: phone,
          contact_email: email,
          website,
          partner_type: type,
          lga,
          access,
          "_id[$oid]": id,
          city: data.city,
          contact_person: person,
          country: data.country,
          created_at: data.created_at,
          district: data.district,
          image: data.image,
          last_activity: data.last_activity,
          organization_type: data.organization_type,
          picture: data.picture,
          po_box: data.po_box,
          server: data.server,
          server_code: data.server_code,
          status: data.status,
          updated_at: data.updated_at,
        },
      });
      if (response.data) {
        Swal.fire({
          title: "Success",
          text: "Partner updated",
          icon: "success",
          confirmButtonText: "Cool",
        });

        useRouter.push(`/partners/${id}`);
      } else {
        Swal.fire({
          title: "Error",
          text: "Could not update partner",
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
        text: "An error occured while updating the partner",
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
      <div className={`${styles.view_edit} ${theme}`}>
        <div className={styles.header}>
          <h1 className={styles.name}>Edit Information</h1>

          <Link href={`/partners/${id}`} passHref>
            <button className={styles.back_edit}>Cancel</button>
          </Link>
        </div>
        <form className={styles.main} onSubmit={updatePartner}>
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
            <p className={styles.head}>Partner Type: </p>
            <select
              className={styles.select}
              defaultValue={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="strategic">Strategic</option>
              <option value="paid">Paid</option>
              <option value="fsp">FSP</option>
            </select>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Access: </p>
            <select
              className={styles.select}
              defaultValue={access}
              onChange={(e) => setAccess(e.target.value)}
              required
            >
              <option value="afrijula">Afrijula</option>
              <option value="jangal">Jangal</option>
              <option value="kodo">Kodo</option>
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
