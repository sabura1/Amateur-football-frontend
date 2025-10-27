// src/pages/Matches.jsx
import { useEffect, useState } from "react";
import { fetchMatches } from "../api/matches";
import MatchCard from "../components/MatchCard";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👇 выносим loadMatches наружу
  async function loadMatches() {
    try {
      const data = await fetchMatches();
      setMatches(data);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    } finally {
      setLoading(false);
    }
  }

  // 👇 useEffect теперь только управляет интервалом
  useEffect(() => {
    loadMatches(); // первая загрузка

    const interval = setInterval(loadMatches, 5000); // автообновление каждые 5 секунд
    return () => clearInterval(interval);
  }, []);



  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Загрузка матчей...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">⚽ Ближайшие матчи</h1>

      {matches.length === 0 ? (
        <p className="text-gray-600">Пока нет матчей 😔</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} refreshMatches={loadMatches} />
          ))}
        </div>
      )}
    </div>
  );
}
