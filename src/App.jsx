import { useState, useEffect } from "react";
import Matches from "./pages/Matches";
import CreateMatch from "./pages/CreateMatch";
import Login from "./pages/Login";

function App() {
  const [page, setPage] = useState("matches");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("footy_user"));
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("footy_user");
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div>
    <nav className="w-full flex flex-row flex-nowrap items-center bg-gray-800 text-white py-3 px-6 gap-6">
  {/* левая часть — две кнопки подряд */}
  <button
    onClick={() => setPage("matches")}
    className={`hover:underline inline-flex items-center ${page === "matches" ? "font-bold" : ""}`}
  >
    🏟️ Матчи
  </button>

  <button
    onClick={() => setPage("create")}
    className={`hover:underline inline-flex items-center ${page === "create" ? "font-bold" : ""}`}
  >
    ➕ Создать матч
  </button>

  {/* правая часть — имя и выход; уезжает вправо за счёт ml-auto */}
  <span className="ml-auto text-gray-300 inline-flex items-center">
    👤 {user.name}
  </span>
  <button
    onClick={handleLogout}
    className="hover:underline text-red-300 inline-flex items-center"
  >
    🚪 Выйти
  </button>
</nav>



      <main className="px-6 md:px-10 py-6 bg-gray-50 min-h-screen">
        {page === "matches" ? <Matches /> : <CreateMatch />}
      </main>
    </div>
  );
}

export default App;
