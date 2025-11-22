// placeholder động cho ô tìm kiếm trong trang help
const placeholders = [
  "Search for help...",
  "How can I post an article?",
  "How does CoderHome work?",
  "How to reset my password?",
  "How to contact support?",
  "Where can I find my projects?",
  "How to change my username?",
  "How to report a problem?",
  "How to get verified?",
  "How to use tags effectively?"
];

let index = 0;
const input = document.getElementById("help_search"); // Input cần đổi placeholder
// chuyển placeholder mỗi 3 giây
setInterval(() => {
  index = (index + 1) % placeholders.length;
  const text = placeholders[index];
  input.placeholder = ""; 

  let i = 0;
  const typing = setInterval(() => {
    input.placeholder += text[i];
    i++;
    // dừng tyoping khi hết chữ
    if (i >= text.length) clearInterval(typing);
  }, 40);
}, 3000);