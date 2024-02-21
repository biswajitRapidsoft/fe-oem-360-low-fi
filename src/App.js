import "./App.css";
import Routes from "./routes/Routes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <Routes />
      {/* <PieChart /> */}
      <ToastContainer
        position="top-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={2}
        theme="light"
      />{" "}
    </div>
  );
}

export default App;

// 11.1.24
// half dash is blue
// 21.2.24
