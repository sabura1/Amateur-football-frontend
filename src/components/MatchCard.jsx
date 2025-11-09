import { useState } from "react";

export default function MatchCard({ match, refreshMatches }) {
  const currentUser = JSON.parse(localStorage.getItem("footy_user"));
  const isCreator = currentUser && match.creator_id === currentUser.id;

  const [status, setStatus] = useState(null);
  const [players, setPlayers] = useState([]);
  const [showPlayers, setShowPlayers] = useState(false);

  // Загрузка игроков
  async function loadPlayers() {
    try {
      const res = await fetch(`http://127.0.0.1:8000/matches/${match.id}/players`);
      if (!res.ok) throw new Error("Ошибка загрузки игроков");
      const data = await res.json();
      setPlayers(data);
    } catch (err) {
      console.error(err);
    }
  }

  // Записаться
  const handleJoin = async () => {
    if (!currentUser) return;
    setStatus("loading");
    try {
      const res = await fetch(`http://127.0.0.1:8000/matches/${match.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: currentUser.name,
          contact: currentUser.contact,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Ошибка");
      }

      setStatus("joined");

      if (typeof refreshMatches === "function") {
        await refreshMatches();
      }

      await loadPlayers();
    } catch (err) {
      console.error(err);
      setStatus(err.message);
    }
  };

  // Отменить участие
  const handleLeave = async () => {
    if (!currentUser) return;
    setStatus("loading");
    try {
      const res = await fetch(`http://127.0.0.1:8000/matches/${match.id}/join`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: currentUser.name,
          contact: currentUser.contact,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Ошибка");
      }

      setStatus("left");

      if (typeof refreshMatches === "function") {
        await refreshMatches();
      }

      await loadPlayers();
    } catch (err) {
      console.error(err);
      setStatus(err.message);
    }
  };

  // Удаление матча
  const handleDelete = async () => {
    if (!confirm("Удалить матч?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/matches/${match.id}`, {
        method: "DELETE",
      });
      if (res.ok && typeof refreshMatches === "function") {
        await refreshMatches();
      }
    } catch (err) {
      console.error("Ошибка удаления матча:", err);
    }
  };

  // Текущее число игроков
  const currentCount =
    match.players_count ?? (players.length > 0 ? players.length : 0);

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 transition-all duration-300 hover:shadow-lg">
      {/* Заголовок */}
      <h2 className="text-lg font-semibold">{match.field_name}</h2>

      {/* Основная информация */}
      <p className="text-gray-600 text-sm">📍 {match.address}</p>

      <p className="text-gray-600 text-sm">
        📅 {new Date(match.start_time).toLocaleDateString("ru-RU", { dateStyle: "medium" })}{" "}
        🕒 {new Date(match.start_time).toLocaleTimeString("ru-RU", { timeStyle: "short" })} – 
        {new Date(match.end_time).toLocaleTimeString("ru-RU", { timeStyle: "short" })}
      </p>


      {match.price && <p className="text-gray-700">💸 {match.price} ₽</p>}

      {/* 💬 Комментарий к матчу */}
      {match.comment && (
        <p className="text-gray-700 italic border-t pt-2 mt-2">
          💬 {match.comment}
        </p>
      )}

      {/* 👥 Счётчик игроков */}
      <button
        onClick={() => {
          if (!showPlayers) loadPlayers();
          setShowPlayers(!showPlayers);
        }}
        className="mt-2 text-sm text-blue-600 hover:underline self-start"
      >
        👥 {currentCount} / {match.player_limit} игроков
      </button>

      {/* Список игроков */}
      {showPlayers && (
        <ul className="mt-2 border-t pt-2 text-sm text-gray-700">
          {players.length > 0 ? (
            players.map((p) => (
              <li key={p.id} className="py-1">
                <div className="font-medium">{p.name}</div>
                {isCreator && p.contact && (
                  <div className="text-gray-500 text-xs mt-0.5">
                    📞 {p.contact}
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="text-gray-400">Пока никого</li>
          )}

        </ul>
      )}

      {/* Кнопки участия */}
      <div className="mt-2 flex flex-col gap-2">
        {status === "joined" ? (
          <>
            <p className="text-green-600 text-sm">Вы записаны на матч!</p>
            <button
              onClick={handleLeave}
              disabled={status === "loading"}
              className="bg-red-600 text-white rounded py-1 text-sm hover:bg-red-700 transition"
            >
              Отменить участие
            </button>
          </>
        ) : (
          <button
            onClick={handleJoin}
            disabled={status === "loading"}
            className="mt-1 bg-blue-600 text-white rounded-lg py-1 text-sm hover:bg-blue-700 transition"
          >
            {status === "loading" ? "Обновляю..." : "Записаться"}
          </button>
        )}

        {status &&
          typeof status === "string" &&
          status !== "loading" &&
          status !== "joined" &&
          status !== "left" && (
            <p className="text-red-600 text-xs">{status}</p>
          )}
      </div>

      {/* 🗑 Кнопка удаления — внизу карточки */}
      {isCreator && (
        <button
          onClick={handleDelete}
          className="mt-3 bg-red-600 text-white rounded-lg py-1 text-sm hover:bg-red-700 transition self-start"
        >
          🗑 Удалить матч
        </button>
      )}
    </div>
  );
}
