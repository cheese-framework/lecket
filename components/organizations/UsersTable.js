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
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    {
      title: "Last Active",
      field: "last_login_date",
      render: (rowData) => {
        return timeAgo.format(new Date(rowData.last_login_date));
      },
    },
    { title: "Status", field: "status" },
  ];

  const fetchUsers = async () => {
    try {
      const res = await Axios({
        url: `${API_URL}/organizations_v2/users`,
        data: { organization_id: id },
        method: "GET",
        headers: {
          Authorization: `token ${userData.auth_token}`,
          UserProfile: userData.profile,
          UserKey: userData.UserKey,
          "X-Requested-With": "XMLHttpRequest",
        },
        params: {
          organization_id: id,
        },
      });
      setUsers(res.data);
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
