const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");
const menuOverlay = document.getElementById("menuOverlay");

function showMenu() {
  menuOverlay.classList.add("active");
  menuOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeMenu.focus();
}

function hideMenu() {
  menuOverlay.classList.remove("active");
  menuOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  openMenu.focus();
}

openMenu.addEventListener("click", showMenu);
closeMenu.addEventListener("click", hideMenu);

menuOverlay.addEventListener("click", (event) => {
  if (event.target === menuOverlay) hideMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuOverlay.classList.contains("active")) {
    hideMenu();
  }
});
