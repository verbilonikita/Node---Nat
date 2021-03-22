import axios from "axios";
import { showAlerts } from "./alert";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: { email, password },
    });
    if (res.data.status === "success") {
      showAlerts("success", "You are logged in");
      window.setTimeout(() => {
        location.assign("/");
      });
    }
  } catch (err) {
    showAlerts("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/login",
    });
    if (res.data.status === "success") location.assign("/login");
  } catch (err) {
    showAlerts("error", "failed to logout, try again");
  }
};
