# CoderHome

Dự án **CoderHome** là một ứng dụng web đơn giản được xây dựng bằng **HTML, CSS, JavaScript thuần**, kết hợp với **Express.js** để tạo API backend và thao tác với MongoDB.

Mục tiêu của dự án:

---

## 🚀 Tính năng chính

* 📄 **Xem bài viết**
* ➕ **Tạo bài viết**
* 👤 **Đăng ký / Đăng nhập**
* 🛡️ **Phân quyền (Admin / User)**
* 💬 **Bình luận bài viết**
* 🕒 **Xem lịch sử bài viết đã xem**
* 📝 **Xem danh sách bài viết của tác giả theo dõi**
* 🔍 **Tìm kiếm bài viết và người dùng**
* 👤✨ **Quản lý hồ sơ cá nhân**

---

## 📁 Cấu trúc thư mục

```
project/
├── public/             # HTML, CSS, JS client
├── src/
│   ├── routes/         # API routes Express
│   ├── controllers/    # Controller xử lý logic
│   ├── models/         # Mongoose schemas
│   ├── server.js       # File khởi chạy server
├── .env.example        # File mẫu cấu hình
├── package.json
└── README.md
```

---

## 🔧 Hướng dẫn cài đặt

### 1. Clone repository

```
$ git clone https://github.com/hoangnnh/IE104_DoAn_CoderHome.git
$ cd IE104_DoAn_CoderHome
```

### 2. Cài đặt package

```
npm install
```

### 3. Chạy server

```
npm start
```

Hoặc dùng nodemon:

```
npm run dev
```

Server sẽ chạy tại:

```
http://localhost:3000
```

---

## 🔑 Tài khoản test

Dưới đây là tài khoản Admin để bạn trải nghiệm tính năng quản trị (UI) :

**Tài khoản Admin:**

```
Email: kien123@gmail.com
Mật khẩu: 123
```

> Lưu ý: Tài khoản này chỉ dành cho mục đích demo.

---

## 🧪 Hướng dẫn test

1. Truy cập trang đăng nhập.
2. Nhập tài khoản Admin hoặc tạo tài khoản người dùng mới.

---

## 🛠 Công nghệ sử dụng

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Express.js
* **Database:** MongoDB + Mongoose
* **Dev tools:** Nodemon

---

## 📩 Liên hệ

Nếu các bạn muốn cải tiến dự án hoặc gặp lỗi, các bạn có thể liên hệ với nhóm mình qua Gmail: 23520532@gmail.com.

Chúc bạn trải nghiệm vui vẻ! 🚀
