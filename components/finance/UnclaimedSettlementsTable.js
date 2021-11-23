import { useRef } from "react";
import Table from "@/components/container/Table";
import useRouter from "next/router";
import { API_URL, compileQuery } from "@/config/index";
import { dateFormat, currencyFormat } from "@/utils/utils";
import styles from "@/styles/Anime.module.css";

export default function UnclaimedSettlementsTable({ userData }) {
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

  const loadPendingClaims = (query, resolve, reject) => {
    let filter = "_type: {'$eq': 'Afrijula::Shop::SettlementSale'}, ";

    filter += "settlement_status:{'$eq': 'none'}";

    let include = {
      include:
        "{order: {only: [:customer_name,:order_status,:customer_phone]}}",
    };

    let url = compileQuery(
      query,
      API_URL + "/finance/revenue",
      ["total", "number", "id", "description", "settlement_status", "date"],
      [{ by: "desc", attr: "date" }],
      "Afrijula::Shop::SettlementSale",
      include,
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
                  customer_name: data.order.customer_name,
                  description: data.description,
                  date: dateFormat(data.date),
                  amount: currencyFormat(data.total),
                  status: data.settlement_status,
                  _id: data._id,
                  customer_phone: data.order.customer_phone,
                  number: data.number,
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
            loadPendingClaims(query, resolve, reject);
          })
        }
        title="Unclaimed Settlements"
        columnsData={columns}
        search={true}
        rowCount={10}
        // method={loadDetails}
      />
    </div>
  );
}
