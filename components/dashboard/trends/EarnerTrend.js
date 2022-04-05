import styles from "@/styles/Dashboard/Table.module.css";

const EarnerTrend = () => {
  return (
    <div className={styles.tableroom} style={{ margin: 0 }}>
      <div className={styles.filterRoom}>
        <div>
          <h2>Top Earners </h2>
        </div>
      </div>
      <div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Chibuike Jude</td>
              <td>
                <i
                  className="fa fa-long-arrow-alt-up"
                  style={{
                    color: "green",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                ></i>
                <span style={{ color: "#555", fontSize: "10px" }}>15%</span>
              </td>
            </tr>
            <tr>
              <td>John Doe</td>
              <td>
                <i
                  className="fa fa-long-arrow-alt-up"
                  style={{
                    color: "green",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                ></i>
                <span style={{ color: "#555", fontSize: "10px" }}>5%</span>
              </td>
            </tr>
            <tr>
              <td>Jane Doe</td>
              <td>
                <i
                  className="fa fa-long-arrow-alt-down"
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                ></i>
                <span style={{ color: "#555", fontSize: "10px" }}>2%</span>
              </td>
            </tr>
            <tr>
              <td>Mary Poppins</td>
              <td>
                <i
                  className="fa fa-long-arrow-alt-up"
                  style={{
                    color: "green",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                ></i>
                <span style={{ color: "#555", fontSize: "10px" }}>0.2%</span>
              </td>
            </tr>
            <tr>
              <td>Mariama Thompson</td>
              <td>
                <i
                  className="fa fa-long-arrow-alt-up"
                  style={{
                    color: "green",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                ></i>
                <span style={{ color: "#555", fontSize: "10px" }}>3%</span>
              </td>
            </tr>
            <tr>
              <td>Ousman Faal</td>
              <td>
                <i
                  className="fa fa-long-arrow-alt-down"
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                ></i>
                <span style={{ color: "#555", fontSize: "10px" }}>0.5%</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EarnerTrend;
