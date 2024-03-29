// // DataContext.js
// import { createContext, useContext, useState } from "react";

// const DataContext = createContext();

// export function DataProvider({ children }) {
//   const [data, setData] = useState("Hello from Context");

//   return <DataContext.Provider value={{ data, setData }}>{children}</DataContext.Provider>;
// }

// export function useData() {
//   return useContext(DataContext);
// }
