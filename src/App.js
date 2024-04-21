import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./Views/LoginView";
import Dashboard from "./Views/Dashboard";
import "antd/dist/reset.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginView />} path="/" />
        <Route element={<Dashboard />} path="/dashboard" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
