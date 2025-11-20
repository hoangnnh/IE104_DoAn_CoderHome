# CoderHome 🏠

Dự án **CoderHome** là một ứng dụng web đơn giản được xây dựng bằng **HTML, CSS, JavaScript thuần**, kết hợp với **Express.js** để tạo API backend và thao tác với MongoDB.

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
IE104_DoAn_CoderHome/
├── .gitignore              # Danh sách file/thư mục không đưa vào Git
├── app.js                  # File khởi tạo ứng dụng Express
├── controllers             # Chứa các controller xử lý logic cho route
├── middleware              # Middleware tùy chỉnh (auth, logger, …)
├── models                  # Mô hình dữ liệu (MongoDB/Mongoose)
├── node_modules            # Thư viện cài bằng npm (tự tạo, không commit)
├── package-lock.json       # Lưu phiên bản chính xác của từng dependency
├── package.json            # Metadata project + scripts + danh sách thư viện
├── public                  # Static files phục vụ client
│   ├── fonts               # Font chữ
│   ├── images              # Hình ảnh tĩnh
│   ├── scripts             # JavaScript chạy ở client
│   └── styles              # CSS, stylesheet
├── README.md               # Tài liệu mô tả project
├── routes                  # Định nghĩa các route của hệ thống
└── views                   # Template giao diện (EJS, Handlebars,…)
    └── pages               # Các trang giao diện cụ thể

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

**Tài khoản User:**

```
Email: kien234@gmail.com
Mật khẩu: 123
```

Dưới đây là tài khoản Admin để bạn trải nghiệm tính năng quản trị (UI):

**Tài khoản Admin:**

```
Email: kien123@gmail.com
Mật khẩu: 123
```

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

Nếu các bạn muốn cải tiến dự án hoặc gặp lỗi, các bạn có thể liên hệ với nhóm mình qua Gmail: 23520532@gm.uit.edu.vn.

Chúc bạn trải nghiệm vui vẻ! 🚀

