// Lấy nút submit và phần hiển thị lỗi
const submitBtn = document.querySelector(".form-btn");
const errorText = document.querySelector(".error-text");

// Hàm xử lý khi người dùng bấm nút đăng nhập
async function submitLogInForm(e) {
    e.preventDefault(); // Ngăn trang web reload khi submit form

    // Lấy giá trị email và mật khẩu từ input
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    // Gửi yêu cầu đăng nhập lên server
    const res = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password}) // Gửi dữ liệu dạng JSON
    });

    // Nhận phản hồi từ server
    const loginState = await res.json();

    // Sai email hoặc mật khẩu
    if (loginState.state === "invalid") {
        errorText.textContent = "Invalid email or password!";
    }

    // Đăng nhập thành công → chuyển trang
    else if (loginState.state === "success") {
        window.location.href = loginState.redirectUrl;
    }

    // Lỗi server → vẫn chuyển hướng theo URL trả về
    else if (loginState.state === "error") {
        window.location.href = loginState.redirectUrl;
    }
}

// Lắng nghe sự kiện click nút Submit để xử lý đăng nhập
submitBtn.addEventListener("click", submitLogInForm);
