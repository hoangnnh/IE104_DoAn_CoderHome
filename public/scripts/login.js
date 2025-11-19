const submitBtn = document.querySelector(".form-btn");
const errorText = document.querySelector(".error-text");

async function submitLogInForm(e) {
    e.preventDefault(); 
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const res = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
    });

    const loginState = await res.json();
    if (loginState.state === "invalid") {
        errorText.textContent = "Invalid email or password!";
    }

    else if (loginState.state === "success") {
        alert("Login Successful!");
        window.location.href = loginState.redirectUrl;
    }

    else if (loginState.state === "error") {
        window.location.href = loginState.redirectUrl;
    }
}

submitBtn.addEventListener("click", submitLogInForm);   