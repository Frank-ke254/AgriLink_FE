document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const selectedRole = document.getElementById("role").value;
  const message = document.getElementById("loginMessage");
  message.textContent = "Signing you in...";

  try {
    await window.AgriApi.login({ username: email, password });
    const me = await window.AgriApi.me();
    if (selectedRole && me.role !== selectedRole) {
      message.textContent = `This account is registered as ${me.role}.`;
      return;
    }

    message.textContent = "Login successful! Redirecting...";
    window.setTimeout(() => {
      window.location.href = me.role === "urban" ? "dashboard.html" : "dashrural.html";
    }, 700);
  } catch (error) {
    message.textContent = error.message || "Login failed. Please check your credentials.";
  }
});