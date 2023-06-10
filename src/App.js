import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Config from "./pages/ConfigPage";
import DJTool from "./pages/DjVjPage";
import DjVjPage from "./pages/DjVjPage";
import ConfigPage from "./pages/ConfigPage";
import "primereact/resources/themes/md-dark-indigo/theme.css";     
import "primereact/resources/primereact.min.css";  
import 'primeicons/primeicons.css';                                     
import "./App.css";

function App() {
  return (
    <div className="app">
      <main>
          <Routes>
            <Route path="/dj-vj-tool" element={<DjVjPage />} />
            <Route path="/config" element={<ConfigPage />} />
            <Route path="*" element={<Navigate to="/config" />} />
          </Routes>
      </main>
    </div>
  );
}

export default App;
