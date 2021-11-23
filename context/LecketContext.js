import { createContext, useState, useEffect } from "react";
import Axios from "axios";
import cookies from "react-cookies";

const LecketContext = createContext();

export const LecketProvider = ({ children }) => {
  const [appTheme, setAppTheme] = useState();
  useEffect(() => {
    const theme = cookies.load("theme");
    // console.log(theme);
    setAppTheme(theme);
  }, [appTheme]);

  // set Theme
  const setTheme = async (theme) => {
    try {
      await Axios.post("/api/theme", { theme });
      setAppTheme(theme);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <LecketContext.Provider value={{ appTheme, setAppTheme, setTheme }}>
      {children}
    </LecketContext.Provider>
  );
};

export default LecketContext;
