/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LoginProvider } from "./contexts/login.tsx";
import { ThemeProvider } from "./contexts/theme.tsx";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { BrowserRouter, Route, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LoginProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <Routes>
              <Route path="/" element={<App />} />
            </Routes>
          </QueryParamProvider>
        </BrowserRouter>
      </ThemeProvider>
    </LoginProvider>
  </React.StrictMode>
);
