import BillList from './modules/billList.js';
const billListEl = document.querySelector(".monthly__expense-details");
const openModalTriggerEl = document.querySelector(".trigger");
const closeModalEl = document.querySelector(".close-exit");
const modalEl = document.querySelector(".add-bill-modal");

if (billListEl) {
  BillList.init();
  main();
}
function main() {
  openModalTriggerEl.addEventListener("click", function () {
    modalEl.classList.add("open");
  });
  closeModalEl.addEventListener("click", function () {
    modalEl.classList.remove("open");
  });
  window.addEventListener("click", function (event) {
    if (event.target === modalEl) {
      modalEl.classList.remove("open");
    }
  })
}