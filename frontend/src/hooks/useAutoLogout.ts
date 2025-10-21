import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes (in ms)

export function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const updateLastActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    // Track user interactions
    window.addEventListener("mousemove", updateLastActivity);
    window.addEventListener("keydown", updateLastActivity);
    window.addEventListener("scroll", updateLastActivity);
    window.addEventListener("click", updateLastActivity);

    // Initialize activity timestamp on first load
    updateLastActivity();

    const checkInactivity = setInterval(() => {
      const last = parseInt(localStorage.getItem("lastActivity") || "0", 10);
      const now = Date.now();

      if (now - last > INACTIVITY_LIMIT) {
        // Clear session and redirect
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("lastActivity");

        alert("Session expired due to inactivity. Please log in again.");
        navigate("/login", { replace: true });
      }
    }, 60 * 1000); // Check every minute

    return () => {
      // Cleanup listeners and timer
      clearInterval(checkInactivity);
      window.removeEventListener("mousemove", updateLastActivity);
      window.removeEventListener("keydown", updateLastActivity);
      window.removeEventListener("scroll", updateLastActivity);
      window.removeEventListener("click", updateLastActivity);
    };
  }, [navigate]);
}
