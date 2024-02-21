import React from "react";
import { Routes, Route } from "react-router-dom";
// import LoginForm from "../components/LoginForm";
// import Dash from "../components/Dash";
import LoadingComponent from "../components/LoadingComponent";

const LoginForm = React.lazy(() => import("../components/LoginForm"));
const Dash = React.lazy(() => import("../components/Dash"));

const route = () => {
  return (
    <>
      <React.Suspense fallback={<LoadingComponent open={true} />}>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/dash" element={<Dash />} />
        </Routes>
      </React.Suspense>
    </>
  );
};

export default route;
