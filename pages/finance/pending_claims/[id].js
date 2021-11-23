import { useState, useEffect, useContext } from "react";
import { isLoggedIn } from "@/utils/utils";
import Head from "next/head";
import Link from "next/link";
import useRouter from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import Axios from "axios";
import { API_URL, FINANCE } from "@/config/index";
import { dateFormat, currencyFormat } from "@/utils/utils";
import styles from "@/styles/DetailPage.module.css";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";
import LecketContext from "@/context/LecketContext";

export default function DetailsPending({ userData, id }) {
  const [data, setData] = useState([]);
  const [chequeNo, setChequeNo] = useState(data.check_number || "");
  const [bankName, setBankName] = useState(data.bank_name || "");
  const [payTo, setPayTo] = useState(data.payable_to || "");
  const [comments, setComments] = useState(data.comments || "");
  const [loading, setLoading] = useState(false);

  const { appTheme } = useContext(LecketContext);

  const loadDetails = async () => {
    try {
      const response = await Axios.get(`${API_URL}/finance/revenue/${id}`, {
        params: { type: "claim" },
        headers: {
          Accept: "application/json",
          Authorization: `token ${userData.auth_token}`,
          UserProfile: userData.profile,
          UserKey: userData.UserKey,
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      // console.log(response.data);
      setData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const processCheque = async () => {
    if (bankName && chequeNo) {
      if (
        data.s_type === "check" &&
        confirm("Merchant requested transfer. Are you sure?")
      ) {
        setLoading(true);
        try {
          const response = await Axios.put(
            `${API_URL}/finance/revenue/${id}`,
            {
              type: "claim",
              check_number: chequeNo,
              bank_name: bankName,
              pay_to: payTo,
              summary: comments,
              s_type: "check",
            },
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
          setData(response.data);
        } catch (err) {
          console.log(err);
          Swal.fire({
            title: "Error",
            text: "Cheque could not be processed. Please try again.",
            icon: "error",
          });
        }
        setLoading(false);
      }
    } else {
      Swal.fire({
        title: "Error",
        text: "Bank Name and Cheque Number are required fields",
        icon: "error",
      });
    }
  };

  const confirmPicked = async () => {
    setLoading(true);
    try {
      await Axios.put(
        `${API_URL}/finance/revenue/${id}`,
        { type: "claim_picked" },
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
        text: "Pick up confirmed",
        icon: "success",
        preConfirm: () => useRouter.push(`/finance/pending_claims`),
        showLoaderOnConfirm: true,
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Error",
        text: "Could not confirm pick up",
        icon: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => loadDetails(), [id]);

  return (
    <DashboardLayout userData={userData}>
      <Head>
        <meta description="viewport" content="width=device-width" />
        <title>{data.account_name || "..."} | Lecket</title>
      </Head>
      <div className={`${styles.view_edit} ${appTheme}`}>
        <div className={styles.header}>
          <h1 className={styles.name}>Pending Claim Information</h1>
          <Link href={`/finance/pending_claims`} passHref>
            <button className={styles.back}>Back</button>
          </Link>
        </div>
        <div className={styles.main}>
          <div className={styles.details}>
            <p className={styles.head}>Merchant Name: </p>
            <p className={styles.body}>{data.account_name}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Contact Person: </p>
            <p className={styles.body}>
              {data.organization && data.organization.contact_person}
            </p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Contact Email: </p>
            <p className={styles.body}>
              {data.organization && data.organization.contact_email}
            </p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Contact Number: </p>
            <p className={styles.body}>
              {data.organization && data.organization.contact_number}
            </p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Amount: </p>
            <p className={styles.body}>
              GMD
              {data.amount && (parseFloat(data.amount.cents) / 100).toFixed(2)}
            </p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Account Number: </p>
            <p className={styles.body}>{data.account_number}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Account Name: </p>
            <p className={styles.body}>{data.account_name}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Bank Name: </p>
            <p className={styles.body}>{data.bank_name}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>BBAN Number: </p>
            <p className={styles.body}>{data.bban_number}</p>
          </div>
          {data.orders && (
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>Customer</th>
                  <th className={styles.th}>Order Number</th>
                  <th className={styles.th}>Order Status</th>
                  <th className={styles.th}>Payment Type</th>
                  <th className={styles.th}>Amount</th>
                  <th className={styles.th}>Order Date</th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                {data.orders.map((order, index) => {
                  return (
                    <tr key={index} className={styles.tr}>
                      <td className={styles.td}>{order.customer_name}</td>
                      <td className={styles.td}>{order.shop_order_id}</td>
                      <td className={styles.td}>{order.merchant_status}</td>
                      <td className={styles.td}>{order.payment_method}</td>
                      <td
                        className={styles.td}
                      >{`${order.order_amount}${order.currency}`}</td>
                      <td className={styles.td}>
                        {dateFormat(order.date_purchased)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <div className={styles.details}>
            <p className={styles.head}>Transaction Fee: </p>
            <p className={styles.body}>
              {currencyFormat(data.transaction_fee)}
            </p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Status: </p>
            <p className={styles.body}>{data.request_status}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.head}>Claim Type: </p>
            <p className={styles.body}>{data.s_type}</p>
          </div>
          {data.request_status === "sent" ? (
            <>
              <div className={styles.details}>
                <p className={styles.head}>Check Number: </p>
                <input
                  className={styles.input}
                  placeholder="Cheque Number"
                  value={chequeNo}
                  onChange={(e) => setChequeNo(e.target.value)}
                />
              </div>
              <div className={styles.details}>
                <p className={styles.head}>Bank Name: </p>
                <input
                  className={styles.input}
                  placeholder="Bank Name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
              <div className={styles.details}>
                <p className={styles.head}>Pay To: </p>
                <input
                  className={styles.input}
                  placeholder="Pay To"
                  value={payTo}
                  onChange={(e) => setPayTo(e.target.value)}
                />
              </div>
              <div className={styles.details}>
                <p className={styles.head}>Comment: </p>
                <textarea
                  className={styles.input}
                  placeholder="Comment"
                  onChange={(e) => setComments(e.target.value)}
                >
                  {comments}
                </textarea>
              </div>
              <div className={styles.save}>
                {loading ? <Loader /> : null}
                <input
                  className={styles.button}
                  type="submit"
                  value="PROCESS CHEQUE"
                  onClick={processCheque}
                  disabled={loading}
                />
                {/* <input
                  className={styles.button}
                  type="submit"
                  value="SEND RTGS"
                  style={{
                    backgroundImage: `radial-gradient(
                100% 100% at 100% 0,
                rgb(17, 173, 95) 0,
                rgb(11, 138, 49) 100%
              )`,
                    margin: "20px",
                  }}
                /> */}
              </div>{" "}
            </>
          ) : (
            <>
              <div className={styles.details}>
                <p className={styles.head}>Check Number: </p>
                <p className={styles.body}>{data.check_number}</p>
              </div>
              <div className={styles.details}>
                <p className={styles.head}>Bank Name: </p>
                <p className={styles.body}>{data.bank_name}</p>
              </div>
              <div className={styles.details}>
                <p className={styles.head}>Payable To: </p>
                <p className={styles.body}>{data.payable_to}</p>
              </div>
              <div className={styles.details}>
                <p className={styles.head}>RTGS Reference: </p>
                <p className={styles.body}>{data.rtgs_reference_number}</p>
              </div>
              <div className={styles.details}>
                <p className={styles.head}>Comment: </p>
                <p className={styles.body}>{data.comments}</p>
              </div>
              <div className={styles.save}>
                {loading ? <Loader /> : null}

                <input
                  className={styles.button}
                  type="submit"
                  value="Check Delivered"
                  onClick={confirmPicked}
                  disabled={loading}
                  style={{
                    backgroundImage: `radial-gradient(
                100% 100% at 100% 0,
                rgb(17, 173, 95) 0,
                rgb(11, 138, 49) 100%
              )`,
                    margin: "5px 10px",
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps({ req, query: { id } }) {
  const userData = isLoggedIn(req);
  if (userData && id) {
    // check if the user accessing this route has the right permission
    if (userData.user_type === FINANCE) {
      return {
        props: {
          userData,
          id,
        },
      };
    } else {
      // redirect to 403 page
      return {
        redirect: {
          permanent: false,
          destination: "/403",
        },
        props: {},
      };
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
}
