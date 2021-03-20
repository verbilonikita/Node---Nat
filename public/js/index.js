import { login, logout } from "./login.js";
import { updateSettings } from "./updateSettings";

const form = document.querySelector(".form--login");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

const logoutBtn = document.querySelector(".nav__el--logout");

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

const userDataForm = document.querySelector(".form-user-data");

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    const email = document.querySelector("#email").value;
    const name = document.querySelector("#name").value;
    updateData({ name, email }, "data");
  });
}

const userPassword = document.querySelector(".form-user-settings");

if (userPassword) {
  userPassword.addEventListener("submit", (e) => {
    const passwordCurrent = document.querySelector("#password-current").value;
    const password = document.querySelector("#password").value;
    const passwordConfirm = document.querySelector("#password-confirm").value;
    updateSettings({ passwordCurrent, password, passwordConfirm }, "password");
  });
}
