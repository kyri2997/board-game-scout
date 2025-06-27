export async function getGameRecommendations(answers) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(answers),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  const data = await res.json();
  return data.games; // ✅ return the actual array
}
