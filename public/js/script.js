const pswdBtn = document.querySelector("#pswdBtn");
pswdBtn.addEventListener("click", function () {
  const pswInput = document.getElementById("account_password");
  const type = pswInput.getAttribute("type");
  if (type === "password") {
    pswInput.setAttribute("type", "text");
    pswdBtn.textContent = "Hide Password";
  } else {
    pswInput.setAttribute("type", "password");
    pswdBtn.textContent = "Show Password";
  }
});
