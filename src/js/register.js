document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const role = document.getElementById("role").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("regMessage");
  message.textContent = "Creating account...";

  try {
    await window.AgriApi.register({
      username: email,
      email,
      password,
      role,
    });

    localStorage.setItem("farmcycle_full_name", fullName);
    message.textContent = "Account registered successfully! Redirecting...";
    window.setTimeout(() => {
      window.location.href = role === "urban" ? "dashboard.html" : "dashrural.html";
    }, 700);
  } catch (error) {
    message.textContent = error.message || "Registration failed. Try another email.";
  }
});
