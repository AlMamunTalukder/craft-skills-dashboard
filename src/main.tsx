import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import Providers from "./lib/Providers/Providers";
import { Provider } from "react-redux";
import { store } from "./redux/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </Providers>
  </StrictMode>,
);
