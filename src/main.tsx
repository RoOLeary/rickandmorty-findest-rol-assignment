/* eslint-disable react/react-in-jsx-scope */
import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);

if (process.env.NODE_ENV === "development") {
  // Prepare MSW in a Service Worker
  import("../mocks/browser")
    .then(({ worker }) => {
      worker.start();
    })
    // Launched mock server, and then start client React app
    .then(() => root.render(<App />));
} else {
  // Production
  root.render(<App />);
}
