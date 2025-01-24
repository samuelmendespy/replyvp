import axios from "axios";

const AUTH_URL = "http://localhost:8080/auth/users/auth.php";

export function getToken() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token || null;
}

export async function validateToken() {
  const token = getToken();

  if (!token) {
    return false;
  }

  try {
    const response = await axios.get(AUTH_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.success;
  } catch (error) {
    console.error("Token inválido ou expirado:", error.response?.data || error.message);
    localStorage.removeItem("user");
    return false;
  }
}