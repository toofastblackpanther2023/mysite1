"use strict";
{
  const menuItems = document.querySelectorAll(".menu li a");
  const explanations = document.querySelectorAll(".explanation");

  menuItems.forEach((clickeditem) => {
    clickeditem.addEventListener("click", (e) => {
      e.preventDefault();
      menuItems.forEach((item) => {
        item.classList.remove("active");
      });
      clickeditem.classList.add("active");
      explanations.forEach((explanation) => {
        explanation.classList.remove("active");
      });
    document.getElementById(clickeditem.dataset.id).classList.add("active");
    });
  });
}
