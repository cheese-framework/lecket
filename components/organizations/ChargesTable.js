import { useEffect, useState } from "react";
import useRouter from "next/router";
import Table from "@/components/container/Table";
import en from "javascript-time-ago/locale/en";
import TimeAgo from "javascript-time-ago";
import { API_URL } from "@/config/index";
import Axios from "axios";
import styles from "@/styles/Anime.module.css";
import Swal from "sweetalert2";
import { dateFormat, currencyFormat } from "@/utils/utils";

export default function ChargesTable({ userData, id }) {
  const [charges, setCharges] = useState([]);

  const columns = [
    {
      title: "Date",
      field: "date",
      render: (rowData) => dateFormat(rowData.date),
      cellStyle: { padding: "4px" },
      headerStyle: { padding: "4px" },
    },
    {
      title: "Amount",
      field: "amount",
      render: (rowData) => currencyFormat(rowData.amount),
      cellStyle: { padding: "4px" },
      headerStyle: { padding: "4px" },
    },
  ];

  const loadBilling = async () => {
    try {
      const response = await Axios.get(`${API_URL}/organizations_v2/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `token ${userData.auth_token}`,
          UserProfile: userData.profile,
          UserKey: userData.UserKey,
          "X-Requested-With": "XMLHttpRequest",
        },
        params: {
          billing: true,
        },
      });

      setCharges(response.data.charges);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCharge = (data) => {
    const chargeId = data._id.$oid;

    Swal.fire({
      title: "Do you want to delete this charge?",
      text: "This charge will be deleted permanently",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      focusConfirm: false,
    }).then((val) => {
      if (val.isConfirmed) {
        Axios.delete(`${API_URL}/organizations_v2/${id}/billing`, {
          params: { charges: [chargeId] },
          headers: {
            Accept: "application/json",
            Authorization: `token ${userData.auth_token}`,
            UserProfile: userData.profile,
            UserKey: userData.UserKey,
            "X-Requested-With": "XMLHttpRequest",
          },
        })
          .then((res) => alert("Charge deleted"))

          .catch((err) => console.log(err));
      }
    });
  };

  useEffect(() => {
    loadBilling();
  }, []);

  return (
    <div className={styles.fadein}>
      <Table
        dataset={charges}
        title="Charges"
        columnsData={columns}
        search={true}
        method={deleteCharge}
      />
    </div>
  );
}
