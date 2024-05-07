import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import InitWrapper from "./layouts/InitWrapper";
import Router from "./router";
import store from "./states/store";
const client = new QueryClient();
function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <InitWrapper>
          <RouterProvider router={Router} />
        </InitWrapper>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
