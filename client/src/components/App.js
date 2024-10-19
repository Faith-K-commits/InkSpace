import React from "react";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-Poppins">
      <Outlet />
    </div>
  );
}

export default App;
