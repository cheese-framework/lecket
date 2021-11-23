import { useRef } from "react";
import Table from "@/components/container/Table";
import useRouter from "next/router";
import { API_URL, compileQuery } from "@/config/index";
import { dateFormat, currencyFormat } from "@/utils/utils";
import styles from "@/styles/Anime.module.css";

export default function PendingClaimsTable({ userData }) {
  const cashDeliveryRef = useRef();

  const columns = [
    {
      title: "Customer",
      field: "customer_name",
    },
    {
      title: "Type",
      field: "s_type",
    },
    {
      title: "Date",
      field: "confirmed_on",
    },
    {
      title: "Amount",
      field: "amount",
    },
    {
      title: "Fees",
      field: "fee",
    },
    {
      title: "Number",
      field: "reference_number",
    },
    {
      title: "Status",
      field: "request_status",
    },
  ];

  const loadPendingClaims = (query, resolve, reject) => {
    let filter =
      "'$or': [{request_status:{'$eq': 'sent'}},{transaction_complete:{'$eq': false}}]";

    let url = compileQuery(
      query,
      API_URL + "/finance/revenue",
      [
        "amount",
        "reference_number",
        "id",
        "transaction_fee",
        "s_type",
        "confirmed_on",
        "request_status",
        "account_name",
      ],
      [{ by: "desc", attr: "date" }],
      "Afrijula::Shop::Settlement",
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
                  amount: currencyFormat(data.amount),
                  confirmed_on: dateFormat(data.confirmed_on),
                  reference_number: data.reference_number,
                  fee: currencyFormat(data.transaction_fee),
                  s_type: data.s_type,
                  _id: data._id,
                  request_status: data.request_status,
                  customer_name: data.account_name,
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

  const loadDetails = (data) => {
    const id = data._id.$oid;
    useRouter.push(`/finance/pending_claims/${id}`);
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
        title="Pending Claims"
        columnsData={columns}
        search={true}
        rowCount={10}
        method={loadDetails}
      />
    </div>
  );
}
