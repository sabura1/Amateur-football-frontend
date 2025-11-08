import { useState } from "react";

export default function CreateMatch() {
  const [form, setForm] = useState({
    field_name: "",
    address: "",
    date: "",
    time: "",
    max_players: "",
    price: ""
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const user = JSON.parse(localStorage.getItem("footy_user"));

    try {
      const res = await fetch("http://127.0.0.1:8000/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field_name: form.field_name,
          address: form.address,
          date_time: `${form.date}T${form.time}`,
          player_limit: Number(form.max_players),
          price: form.price ? Number(form.price) : null,
          creator_id: user?.id, // 🆕 передаём организатора
        }),
      });

      if (!res.ok) throw new Error("Ошибка при создании матча");

      setStatus("success");
      setForm({
        field_name: "",
        address: "",
        date: "",
        time: "",
        max_players: "",
        price: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-6 w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold text-center">⚽ Создать матч</h1>

        <input
          name="field_name"
          placeholder="Название поля"
          value={form.field_name}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />

        <input
          name="address"
          placeholder="Адрес поля"
          value={form.address}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />

        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />

        <input
          name="time"
          type="time"
          value={form.time}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />

        <input
          name="max_players"
          type="number"
          placeholder="Количество игроков"
          value={form.max_players}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />

        <input
          name="price"
          type="number"
          placeholder="Стоимость участия (₽)"
          value={form.price}
          onChange={handleChange}
          className="border rounded p-2"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {status === "loading" ? "Создаю..." : "Создать матч"}
        </button>

        {status === "success" && (
          <p className="text-green-600 text-center">Матч создан!</p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-center">Ошибка при создании матча</p>
        )}
      </form>
    </div>
  );
}
