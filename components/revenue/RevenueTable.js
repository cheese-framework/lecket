import { useState, useRef } from "react";
import Table from "@/components/container/Table";
import PrintLayout from "@/components/container/PrintLayout";
import { API_URL, compileQuery } from "@/config/index";
import { dateFormat, currencyFormat } from "@/utils/utils";
import styles from "@/styles/Anime.module.css";
import Axios from "axios";
import Swal from "sweetalert2";

export default function RevenueTable({ userData }) {
  const cashDeliveryRef = useRef();

  const columns = [
    {
      title: "Customer",
      field: "customer_name",
    },
    {
      title: "Date",
      field: "date",
    },
    {
      title: "Description",
      field: "description",
    },
    {
      title: "Amount",
      field: "amount",
    },
    {
      title: "Status",
      field: "status",
    },
  ];

  const loadRevenue = (query, resolve, reject) => {
    let filter = "";

    let url = compileQuery(
      query,
      API_URL + "/finance/revenue",
      [
        "date",
        "amount",
        "rev_type",
        "id",
        "description",
        "customer_name",
        "confirmed",
        "confirmed_on",
        "confirmed_by",
      ],
      [{ by: "desc", attr: "date" }],
      "Lecket::Finance::Revenue",
      null,
      filter,
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
        let data =
          result.data !== undefined
            ? result.data.map((data) => {
                return {
                  customer_name: data.customer_name,
                  description: data.description,
                  date: dateFormat(data.date),
                  amount: currencyFormat(data.amount),
                  status: data.status,
                  _id: data._id,
                  confirmed_by: data.confirmed_by,
                  confirmed_on: data.confirm_date,
                  confirmed: data.confirmed,
                };
              })
            : [];
        resolve({
          data: data,
          page: query.page,
          totalCount: result.total,
        });
      })
      .catch((err) => reject());
  };

  return (
    <div className={styles.fadein}>
      <Table
        tableRef={cashDeliveryRef}
        dataset={(query) =>
          new Promise((resolve, reject) => {
            loadRevenue(query, resolve, reject);
          })
        }
        title="Revenue"
        columnsData={columns}
        search={true}
        rowCount={10}
      />
    </div>
  );
}
