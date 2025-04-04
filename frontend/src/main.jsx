import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThirdwebProvider } from "thirdweb/react";
import { client } from "./hooks/client.js";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain="sepolia" // Ensure Sepolia is set correctly
      clientId="YOUR_CLIENT_ID" // Add client ID from thirdweb dashboard
      autoConnect={true} // Ensures wallet remains connected after refresh
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1a1f3d",
                color: "#fff",
                border: "1px solid #2d2b4d",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#1a1f3d",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#1a1f3d",
                },
              },
            }}
          />
        </PersistGate>
      </Provider>
    </ThirdwebProvider>
  </React.StrictMode>
);
