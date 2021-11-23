import { useState, useEffect } from "react";
import styles from "@/styles/ClearData.module.css";
import SingleData from "@/components/cards/SingleData";
import Axios from "axios";
import { API_URL } from "@/config/index";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";

export default function ClearDataCard({
  theme,
  setShowClearData,
  userData,
  id,
}) {
  const [selections, setSelections] = useState([]);
  const [collections, setCollections] = useState([
    { name: "Sales", records: 0 },
    { name: "Invoices", records: 0 },
    { name: "Contracts", records: 0 },
    { name: "Inventory", records: 0 },
    { name: "Customers", records: 0 },
    { name: "Suppliers", records: 0 },
    { name: "Purchases", records: 0 },
    { name: "Cashbook", records: 0 },
    { name: "Asset Register", records: 0 },
    { name: "Products", records: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getOrgCount();
  }, []);

  const getOrgCount = async () => {
    const response = await Axios.get(
      `${API_URL}/afrijula/afrijula/count_org_items?org_id=${id}`,
      {
        headers: {
          Authorization: `token ${userData.auth_token}`,
          UserProfile: userData.profile,
          UserKey: userData.UserKey,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    const data = response.data;
    setCollections([
      {
        name: "Sales",
        records: data.total_sales,
        model: "Afrijula::Sales::Sale",
        filter: "{tran_type: 'one_time'}",
      },
      {
        name: "Invoices",
        records: data.total_invoices,
        model: "Afrijula::Sales::Sale",
        filter: "{tran_type: 'invoice'}",
      },
      {
        name: "Contracts",
        records: data.total_contracts,
        model: "Afrijula::Sales::Sale",
        filter: "{'tran_type': 'contract'}",
      },
      {
        name: "Inventory",
        records: data.total_inventories,
        model: "Afrijula::Stocks::Stock",
      },
      {
        name: "Customers",
        records: data.total_customers,
        model: "Afrijula::Sales::Customer",
      },
      {
        name: "Suppliers",
        records: data.total_suppliers,
        model: "Afrijula::Suppliers::Supplier",
      },
      {
        name: "Purchases",
        records: data.total_purchases,
        model: "Afrijula::Expenses::Expense",
      },
      {
        name: "Cashbook",
        records: data.total_cashbooks,
        model: "Afrijula::Cashbook::Transaction",
      },
      {
        name: "Asset Register",
        records: data.total_assets,
        model: "Afrijula::AssetRegister::Asset",
      },
      {
        name: "Products",
        records: data.total_products,
        model: "Afrijula::Sales::Product",
      },
    ]);
  };

  const clearData = async () => {
    setLoading(true);
    try {
      await Axios.post(
        `${API_URL}/afrijula/afrijula/clear_data`,
        {
          organization_id: id,
          lists: selections,
        },
        {
          headers: {
            Authorization: `token ${userData.auth_token}`,
            UserProfile: userData.profile,
            UserKey: userData.UserKey,
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
      setSelections([]);
      Swal.fire({
        text: "Data cleared successfully",
        icon: "success",
        title: "Success",
      });
      setShowClearData(false);
    } catch (err) {
      console.log(err);
      Swal.fire({
        text: "Data could not be cleared",
        icon: "error",
        title: "Error",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <div className="backdrop"></div>
      <div className={`${theme} ${styles.clear_layout}`}>
        <div className={styles.aside}>
          <p className={styles.description}>Modules</p>
        </div>
        {collections.map((collection) => (
          <SingleData
            collection={collection}
            key={collection.name}
            theme={theme}
            setSelections={setSelections}
            selections={selections}
          />
        ))}

        <div className={styles.details}>
          <p className={styles.collections}>
            {selections.length > 0
              ? `Data to clear: (${selections.map((item) => item.name)})`
              : "....."}
          </p>
        </div>
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.proceed}`}
            onClick={clearData}
            disabled={selections.length <= 0 || loading}
          >
            Clear
          </button>
          {loading && <Loader />}
          <button
            className={`${styles.btn} ${styles.cancel}`}
            onClick={() => setShowClearData(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
