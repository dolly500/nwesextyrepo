import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import Store from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={Store}>
    <div>
        <App />
        <ToastContainer />
    </div>
  </Provider> 
  </React.StrictMode>
  
);

reportWebVitals();
