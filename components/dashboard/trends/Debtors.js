import styles from "@/styles/Dashboard/Table.module.css";

const Debtors = () => {
  return (
    <div className={styles.tableroom} style={{ margin: 0 }}>
      <div className={styles.filterRoom}>
        <div>
          <h2>Debtors </h2>
        </div>
      </div>
      <div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jane Doe</td>
              <td>GMD 320,000.00</td>
            </tr>
            <tr>
              <td>Mary Poppins</td>
              <td>GMD 130,000.00</td>
            </tr>
            <tr>
              <td>Chibuike Jude</td>
              <td>GMD 25,000.00</td>
            </tr>
            <tr>
              <td>Mariama Thompson</td>
              <td>GMD 30,000.00</td>
            </tr>
            <tr>
              <td>Ousman Faal</td>
              <td>GMD 20,000.00</td>
            </tr>
            <tr>
              <td>John Doe</td>
              <td>GMD 3,000.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Debtors;
