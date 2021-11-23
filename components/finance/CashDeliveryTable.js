import { useState, useRef } from "react";
import Table from "@/components/container/Table";
import PrintLayout from "@/components/container/PrintLayout";
import { API_URL, compileQuery } from "@/config/index";
import { dateFormat, currencyFormat } from "@/utils/utils";
import styles from "@/styles/Anime.module.css";
import Axios from "axios";
import Swal from "sweetalert2";

export default function CashDeliveryTable({ userData }) {
  const cashDeliveryRef = useRef();

  const columns = [
    {
      title: "Order Number",
      field: "reference_number",
    },
    {
      title: "Date",
      field: "date",
    },
    {
      title: "Amount",
      field: "amount",
    },
    {
      title: "Shipping Cost",
      field: "shipping_cost",
    },
    {
      title: "Shipping Method",
      field: "shipping_method",
    },
    {
      title: "Customer Name",
      field: "customer_name",
    },
    {
      title: "Status",
      field: "merchant_status",
    },
  ];

  const loadCashDelivery = (query, resolve, reject) => {
    let filter =
      "'$or': [{merchant_status:{'$eq': 'picked up'}},{merchant_status:{'$eq': 'delivered'}},{merchant_status:{'$eq':'delivery failed'}},{merchant_status:{'$eq':'completed'}}],payment_method: {'$eq':'Cash on Delivery'},payment_settled:{'$eq': false}";

    let url = compileQuery(
      query,
      API_URL + "/finance/revenue",
      [
        "order_amount",
        "shipping_cost",
        "id",
        "currency",
        "shipping_method",
        "customer_name",
        "merchant_status",
        "shop_order_id",
        "date_purchased",
      ],
      [{ by: "desc", attr: "date_purchased" }],
      "Afrijula::Shop::Order",
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
                  amount: currencyFormat(data.order_amount),
                  shipping_cost: currencyFormat(data.shipping_cost),
                  customer_name: data.customer_name,
                  date: dateFormat(data.date_purchased),
                  reference_number: data.shop_order_id,
                  currency: data.currency,
                  shipping_method: data.shipping_method,
                  merchant_status: data.merchant_status,
                  _id: data._id.$oid,
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

  const confirmReceipt = async (data) => {
    const ids = [data._id];
    const formData = new FormData();
    formData.append("ids[]", ids);
    formData.append("reconcile", true);
    if (confirm("Are you sure you want to confirm the receipt?")) {
      try {
        await Axios.put(
          `${API_URL}/finance/revenue/ids`,

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
        Swal.fire({
          title: "Success",
          text: "Receipt confirmation successful",
          icon: "success",
          confirmButtonText: "Great",
        });
        cashDeliveryRef.current && cashDeliveryRef.current.onQueryChange();
      } catch (err) {
        console.log(err);
        alert("Could not confirm receipt");
      }
    }
  };

  return (
    <div className={styles.fadein}>
      <Table
        tableRef={cashDeliveryRef}
        dataset={(query) =>
          new Promise((resolve, reject) => {
            loadCashDelivery(query, resolve, reject);
          })
        }
        title="Cash with delivery company"
        columnsData={columns}
        search={true}
        method={confirmReceipt}
        rowCount={10}
      />
    </div>
  );
}
