fetch("/history/add", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ postId })
});