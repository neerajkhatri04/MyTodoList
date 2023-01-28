const checkboxes = document.querySelectorAll(".myCheck");
const deleteBtn = document.querySelectorAll(".deleteBtn");

function myFunction() {
    checkboxes.forEach((checkbox, index) => {
      if (checkbox.checked === true) {
        deleteBtn[index].style.display = "block";
      } else {
        deleteBtn[index].style.display = "none";
      }
    });
  }



