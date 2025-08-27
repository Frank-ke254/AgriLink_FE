document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;

    console.log({ name, email, role, password });

    document.getElementById("regMessage").textContent = "Account registered successfully! Redirecting...";

    setTimeout(() => {
        if (role === "urban") {
            window.location.href = "dashboard.html";
        } else if (role === "rural") {
            window.location.href = "dashrural.html";
        }
    }, 1500); // Gives user time to see the success message
});
