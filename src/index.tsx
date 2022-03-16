import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "react-query";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@mui/system";
import darkTheme from "./theme";
import { ReactQueryDevtools } from "react-query/devtools";
import { SnackbarProvider } from "notistack";

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <SnackbarProvider maxSnack={5}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          <ThemeProvider theme={darkTheme}>
            <App />
          </ThemeProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
