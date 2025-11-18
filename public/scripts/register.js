const submitBtn = document.querySelector(".form-btn");

async function submitRegisterForm(e) {
    e.preventDefault(); 
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    
    const res = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({firstName, lastName, email, password})
    });

    const registerState = await res.json();
    if (registerState.state === "existed") {
        alert("The email is already registered, please log in!");
        window.location.href = registerState.redirectUrl;
    }

    else if (registerState.state === "success") {
        alert("Register Successful!");
        window.location.href = registerState.redirectUrl;
    }

    else if (registerState.state === "error") {
        window.location.href = registerState.redirectUrl;
    }
}

submitBtn.addEventListener("click", submitRegisterForm);  