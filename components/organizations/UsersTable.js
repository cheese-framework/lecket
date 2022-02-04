import { useEffect, useState } from "react";
import useRouter from "next/router";
import Table from "@/components/container/Table";
import en from "javascript-time-ago/locale/en";
import TimeAgo from "javascript-time-ago";
import { API_URL } from "@/config/index";
import Axios from "axios";
import styles from "@/styles/Anime.module.css";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function UsersTable({ userData, id }) {
  const [users, setUsers] = useState([]);

  const columns = [
    { 
      title: "Name", 
      field: "name", 
      cellStyle: { padding: "4px" },
      headerStyle: { padding: "4px" },
    },
    { 
      title: "Email", 
      field: "email",
      cellStyle: { padding: "4px" },
      headerStyle: { padding: "4px" },
    },
    {
      title: "Last Active",
      field: "last_login_date",
      render: (rowData) => {
        return timeAgo.format(new Date(rowData.last_login_date));
      },
    },
    { 
      title: "Status", 
      field: "status", 
      cellStyle: { padding: "4px" },
      headerStyle: { padding: "4px" },
    },
  ];

  const fetchUsers = async () => {
    try {
      const response = await Axios.get(`${API_URL}/organizations_v2/users`, {
        headers: {
          Accept: "application/json",
          Authorization: `token ${userData.auth_token}`,
          UserProfile: userData.profile,
          UserKey: userData.UserKey,
          "X-Requested-With": "XMLHttpRequest",
        },
        params: {
          organization_id: id,
        },
      });

      setUsers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadSingle = async (data) => {
    const userid = data._id;
    useRouter.push(`/organizations/users/${id}/${userid}`);
  };

  useEffect(() => {
    fetchUsers();
  }, [timeAgo]);

  return (
    <div className={styles.fadein}>
      <Table
        dataset={users}
        title="Users"
        columnsData={columns}
        search={true}
        method={loadSingle}
      />
    </div>
  );
}
