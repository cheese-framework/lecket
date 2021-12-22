import Table from "@/components/container/Table";
import { API_URL, compileQuery } from "@/config/index";
import { dateFormat, currencyFormat } from "@/utils/utils";
import Axios from "axios";
import Swal from "sweetalert2";
import useRouter from "next/router";

export default function OrganizationTable({ userData }) {
  const loadDetails = (rowData) => {
    const id = rowData._id.$oid;
    useRouter.push(`/organizations/${id}`);
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
      columnsData={columns}
      dataset={(query) =>
        new Promise((resolve, reject) => {
          loadOrganizations(query, resolve, reject);
        })
      }
      rowCount={10}
      search={true}
      method={loadDetails}
    />
  );
}
