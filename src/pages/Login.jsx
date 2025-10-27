import { useState } from "react";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ name: "", contact: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("http://127.0.0.1:8000/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Ошибка верификации");
      const user = await res.json();

      // сохраняем пользователя локально
      localStorage.setItem("footy_user", JSON.stringify(user));

      // передаём пользователя обратно в App.jsx
      if (typeof onLogin === "function") onLogin(user);
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
        <h1 className="text-xl font-bold text-center">⚽ Вход</h1>

        <input
          name="name"
          placeholder="Ваше имя"
          value={form.name}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          name="contact"
          placeholder="Номер телефона"
          value={form.contact}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
        >
          {status === "loading" ? "Входим..." : "Продолжить"}
        </button>

        {status === "error" && (
          <p className="text-red-600 text-center">Ошибка при входе</p>
        )}
      </form>
    </div>
  );
}
