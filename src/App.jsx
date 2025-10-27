import { useState } from "react";
import Matches from "./pages/Matches";
import CreateMatch from "./pages/CreateMatch";

function App() {
  const [page, setPage] = useState("matches");

  return (
    <div>
      <nav className="flex justify-center gap-4 bg-gray-800 text-white p-3">
        <button onClick={() => setPage("matches")} className="hover:underline">
          🏟️ Матчи
        </button>
        <button onClick={() => setPage("create")} className="hover:underline">
          ➕ Создать матч
        </button>
      </nav>

      {page === "matches" ? <Matches /> : <CreateMatch />}
    </div>
  );
}

export default App;
