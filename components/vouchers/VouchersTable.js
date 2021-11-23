import { useState } from "react";
import Table from "@/components/container/Table";
import PrintLayout from "@/components/container/PrintLayout";
import { API_URL, compileQuery } from "@/config/index";
import { dateFormat } from "@/utils/utils";
import styles from "@/styles/Anime.module.css";
import Axios from "axios";

export default function VouchersTable({ userData }) {
  const [content, setContent] = useState("");
  const [showPrint, setShowPrint] = useState(false);

  const columns = [
    {
      title: "Created On",
      field: "created_at",
      render: (rowData) => dateFormat(rowData.created_at),
      cellStyle: { padding: "4px" },
      headerStyle: { padding: "4px" },
    },
    {
      title: "Number",
      field: "number",
    },
    {
      title: "Printed Date",
      field: "print_date",
      render: (rowData) => dateFormat(rowData.print_date),
    },
    {
      title: "Printed By",
      field: "printed_by",
    },
  ];

  const loadBatches = (query, resolve, reject) => {
    let url = compileQuery(
      query,
      API_URL + "/kodo/vouchers/batch",
      [
        "id",
        "print_date",
        "number",
        "circulation_date",
        "print_number",
        "printed_by",
        "created_at",
      ],
      [{ by: "asc", attr: "circulation_date" }],
      "Kodo::Payments::Vouchers::VoucherBatch",
      {},
      null
    );

    fetch(url, {
      dataType: "json",
      headers: {
        Accept: "application/json",
        Authorization: `token ${userData.auth_token}`,
        UserProfile: userData.profile,
        UserKey: userData.UserKey,
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        resolve({
          data: result.data,
          page: query.page,
          totalCount: result.total,
        });
      })
      .catch((err) => reject());
  };

  const getBatchData = async (data) => {
    const id = data._id.$oid;
    try {
      const response = await Axios.get(API_URL + "/kodo/vouchers/batch/" + id, {
        headers: {
          Accept: "application/json",
          Authorization: `token ${userData.auth_token}`,
          UserProfile: userData.profile,
          UserKey: userData.UserKey,
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      setContent(response.data);
      setShowPrint(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.fadein}>
      {showPrint ? (
        <PrintLayout content={content} close={() => setShowPrint(false)} />
      ) : (
        <Table
          dataset={(query) =>
            new Promise((resolve, reject) => {
              loadBatches(query, resolve, reject);
            })
          }
          title="Vouchers"
          columnsData={columns}
          search={true}
          method={getBatchData}
        />
      )}
    </div>
  );
}
