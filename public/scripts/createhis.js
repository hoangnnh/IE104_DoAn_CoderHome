const postId = window.location.pathname.split("/post/")[1];

fetch("/history/add", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ postId })
});