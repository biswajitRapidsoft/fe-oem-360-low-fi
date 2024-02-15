import React from "react";

import "./App.css";
// import Piechart from "./components/AGM_DGM/Piechart";
import { Route, Routes, Navigate } from "react-router-dom";

// import Routing from "../src/route/Route";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadingComponent from "./components/AGM_DGM/LoadingComponent";

const SignIn = React.lazy(() => import("./components/AGM_DGM/SignIn"));
const Piechart = React.lazy(() => import("./components/AGM_DGM/Piechart"));

function App() {
  return (
    <div className="App">
      <React.Suspense fallback={<LoadingComponent open={true} />}>
        <Routes>
          <Route path="/" element={<SignIn />} />

          <Route path="/piechart" element={<Piechart />} />
        </Routes>
      </React.Suspense>
      <ToastContainer autoclose={3000} />
    </div>
  );
}

export default App;
