import { useState } from "react";

export default function MatchCard({ match }) {
  const [joining, setJoining] = useState(false);
  const [user, setUser] = useState({ name: "", contact: "" });
  const [status, setStatus] = useState(null);

  const handleJoin = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`http://127.0.0.1:8000/matches/${match.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Ошибка");
      }
      setStatus("success");
      if (typeof refreshMatches === "function") refreshMatches();
    } catch (err) {
      console.error(err);
      setStatus(err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 transition-all duration-300 hover:shadow-lg">
      <h2 className="text-lg font-semibold">{match.field_name}</h2>
      <p className="text-gray-600 text-sm">
        📍 {match.address}
      </p>
      <p className="text-gray-600 text-sm">
        📅 {new Date(match.date_time).toLocaleString("ru-RU", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>
      <p className="text-gray-700">
  👥 {match.players_count ?? 0} / {match.player_limit} игроков
</p>

      {match.price && <p className="text-gray-700">💸 {match.price} ₽</p>}

      {status === "success" ? (
  <div className="flex flex-col gap-2">
    <p className="text-green-600 text-sm">Вы записаны на матч!</p>
    <button
      onClick={async () => {
        try {
          const res = await fetch(
            `http://127.0.0.1:8000/matches/${match.id}/join`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(user),
            }
          );
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Ошибка");
          }
          setStatus("left");
          if (typeof refreshMatches === "function") refreshMatches();
        } catch (err) {
          console.error(err);
          setStatus(err.message);
        }
      }}
      className="bg-red-600 text-white rounded py-1 text-sm hover:bg-red-700 transition"
    >
      Отменить участие
    </button>
  </div>
) : status === "left" ? (
  <p className="text-gray-600 text-sm">Вы покинули матч.</p>
) : joining ? (

        <form onSubmit={handleJoin} className="flex flex-col gap-2">
          <input
            name="name"
            placeholder="Ваше имя"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
            className="border rounded p-1 text-sm"
          />
          <input
            name="contact"
            placeholder="Контакт (телеграм, телефон)"
            value={user.contact}
            onChange={(e) => setUser({ ...user, contact: e.target.value })}
            required
            className="border rounded p-1 text-sm"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-blue-600 text-white rounded py-1 text-sm hover:bg-blue-700 transition"
          >
            {status === "loading" ? "Записываю..." : "Подтвердить"}
          </button>
          {status && status !== "loading" && status !== "success" && (
            <p className="text-red-600 text-xs">{status}</p>
          )}
        </form>
      ) : (
        <button
          onClick={() => setJoining(true)}
          className="mt-2 bg-blue-600 text-white rounded-lg py-1 hover:bg-blue-700 transition"
        >
          Записаться
        </button>
      )}
    </div>
  );
}
