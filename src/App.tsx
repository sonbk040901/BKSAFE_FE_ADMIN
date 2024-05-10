import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import InitWrapper from "./layouts/InitWrapper";
import Router from "./router";
import store from "./states/store";
function App() {
  return (
    <Provider store={store}>
      <InitWrapper>
        <RouterProvider router={Router} />
      </InitWrapper>
    </Provider>
  );
}

export default App;
