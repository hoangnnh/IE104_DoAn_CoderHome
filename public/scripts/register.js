// Lấy nút submit của form đăng ký
const submitBtn = document.querySelector(".form-btn");

// Hàm xử lý submit form đăng ký
async function submitRegisterForm(e) {
    e.preventDefault(); // Ngăn form submit theo cách mặc định
    
    // Lấy giá trị từ các input
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    
    // Gửi dữ liệu đăng ký lên server
    const res = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({firstName, lastName, email, password})
    });

    const registerState = await res.json();

    // Kiểm tra trạng thái phản hồi từ server
    if (registerState.state === "existed") {
        // Email đã tồn tại
        alert("The email is already registered, please log in!");
        window.location.href = registerState.redirectUrl;
    } else if (registerState.state === "success") {
        // Đăng ký thành công
        alert("Register Successful!");
        window.location.href = registerState.redirectUrl;
    } else if (registerState.state === "error") {
        // Xảy ra lỗi khác
        window.location.href = registerState.redirectUrl;
    }
}

// Gắn sự kiện click cho nút submit
submitBtn.addEventListener("click", submitRegisterForm);
