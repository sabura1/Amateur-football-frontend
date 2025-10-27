const API_BASE = "http://127.0.0.1:8000"; // не localhost!

export async function fetchMatches() {
  const res = await fetch(`${API_BASE}/matches`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке матчей");
  }
  return res.json();
}
