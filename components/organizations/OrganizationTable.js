import Table from "@/components/container/Table";
import { API_URL, compileQuery } from "@/config/index";
import { dateFormat, currencyFormat } from "@/utils/utils";
import Axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function OrganizationTable({ userData }) {
  const tableRef = React.createRef();
  const [lastPage, setLastPage] = useState(null);
  // const [recalledPageSize, setRecalledPageSize] = useState(null);

  const router = useRouter();
  let tag = null;
  tag = router.query.page;
  let che = null;

  const loadDetails = (rowData) => {
    const id = rowData._id.$oid;
    router.push(`/organizations/${id}`);
    router.push({
      pathname: `/organizations/${id}`,
      // query: {lastPage}
      query: { che },
    });
  };

  const loadOrganizations = (query, resolve, reject) => {
    const filter = "_type: 'Afrijula'";
    const url = compileQuery(
      query,
      `${API_URL}/organizations_v2`,
      null,
      [{ by: "asc", attr: "created_at" }],
      null,
      { from_admin: true },
      filter
    );

    che = query.page;

    Axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `token ${userData.auth_token}`,
        UserProfile: userData.profile,
        UserKey: userData.UserKey,
        "X-Requested-With": "XMLHttpRequest",
      },
    })

      .then((response) => {
        return response.data;
      })
      .then((result) => {
        resolve({
          data: result.data,
          page: query.page,
          totalCount: result.total,
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: "An error occurred while loading subscribers.",
          icon: "error",
          confirmButtonText: "OK",
        });
        reject();
      });
  };

  const columns = [
    {
      title: "Name",
      field: "name",
    },
    {
      title: "Created On",
      field: "created_at",
      render: (rowData) => dateFormat(rowData.created_at),
    },
    {
      title: "Email",
      field: "email",
    },
    {
      title: "Number",
      field: "number",
    },
    {
      title: "Balance",
      field: "balance",
      render: (rowData) => {
        return currencyFormat(rowData.balance);
      },
    },
    {
      title: "Activity",
      field: "last_activity",
      render: (rowData) => {
        return dateFormat(rowData.last_activity);
      },
    },
    {
      title: "Status",
      field: "status",
    },
  ];

  return (
    <Table
      title="Subscribers"
      tableRef={tableRef}
      columnsData={columns}
      dataset={(query) =>
        new Promise((resolve, reject) => {
          console.log("tag: ", tag);
          if (tag) {
            console.log("tag1: ", tag);
            query.page = tag && Number(tag);
            tag = null;
            console.log("tag2: ", tag);
          }
          // setLastPage(Number(query.page));
          loadOrganizations(query, resolve, reject);
        })
      }
      rowCount={10}
      options={{
        pageSize: 10, //: recalledPageSize || 10
        filtering: true,
        grouping: true,
      }}
      search={true}
      method={loadDetails}
    />
  );
}
