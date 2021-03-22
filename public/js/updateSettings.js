import axios from "axios";
import { showAlerts } from "./alert";

//type is either password or data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "http://127.0.0.1:3000/api/v1/users/updateMyPassword"
        : "http://127.0.0.1:3000/api/v1/users/updateme";
    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") showAlerts("success", "Updated!");
  } catch (err) {
    showAlerts(err, err.response.data.message);
  }
};
