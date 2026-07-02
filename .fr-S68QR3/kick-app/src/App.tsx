import { Outlet } from "react-router";
import "./App.css";
import "./App.css";

export function App() {
  return (
    <div className="min-h-screen w-full text-white bg-black font-sans selection:bg-[#f012be] selection:text-white">
      <Outlet />
    </div>
  );
}
