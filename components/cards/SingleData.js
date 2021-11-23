import { useState, useEffect } from "react";
import styles from "@/styles/ClearData.module.css";

export default function SingleData({
  theme,
  collection,
  setSelections,
  selections,
}) {
  const [select, setSelect] = useState(false);

  const updateSelections = (data) => {
    let inPlace = false;
    let filteredData;
    for (let i = 0; i < selections.length; i++) {
      if (selections[i].name === data.name) {
        inPlace = true;
        filteredData = selections.filter((value) => value.name !== data.name);
        break;
      }
    }
    if (!inPlace) {
      setSelections(
        selections.concat({
          model: data.model,
          filter: data.filter,
          name: data.name,
        })
      );
    } else {
      setSelections(filteredData);
    }
  };

  return (
    <div className={`${styles.wrap} ${select ? styles.glow : null}`}>
      <div className={`${styles.wrapper}`}>
        <div
          className={`${theme} ${styles.single_body} ${
            select ? styles.selected : null
          }`}
        >
          <input
            type="checkbox"
            name=""
            id=""
            className="form_check"
            checked={select}
            onChange={(e) => {
              setSelect(e.target.checked);
              updateSelections(collection);
            }}
            disabled={collection.records <= 0}
          />
          <p className={styles.description}>{collection.name}</p>
          <p>
            <b>{collection.records}</b>
          </p>
        </div>
      </div>
    </div>
  );
}
