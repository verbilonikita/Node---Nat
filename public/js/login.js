import axios from "axios";
import { showAlerts } from "./alert";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/login",
      data: { email, password },
    });
    if (res.data.status === "success") {
      showAlerts("success", "You are logged in");
      window.setTimeout(() => {
        location.assign("/");
      });
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/api/v1/users/login",
    });
    if (res.data.status === "success") location.assign("http://127.0.0.1:3000/login");
  } catch (err) {
    showAlerts("error", "failed to logout, try again");
  }
};
