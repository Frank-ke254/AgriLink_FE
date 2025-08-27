document.getElementById("loginForm").addEventListener("submit", function(e) {
      e.preventDefault();
      const role = document.getElementById("role").value;

      document.getElementById("loginMessage").textContent = "Login successful! Redirecting...";

      setTimeout(() => {
        if (role === "urban") {
          window.location.href = "dashboard.html";
        } else if (role === "rural") {
          window.location.href = "dashrural.html";
        }
      }, 1500);
    });