const openModalTriggerEl = document.querySelector(".trigger");
const closeModalEl = document.querySelector(".close-exit");
const closeModal = document.querySelector(".close-exit-button");
const modalEl = document.querySelector(".add-bill-modal");
const billInputs = document.querySelectorAll('.bill-input');

if (openModalTriggerEl) {
  addBillDisplay();
}
function addBillDisplay() {
  openModalTriggerEl.addEventListener("click", function () {
    modalEl.classList.add("open");
  });
  closeModalEl.addEventListener("click", function () {
    modalEl.classList.remove("open");
    billInputs.forEach(elem => elem.value = '');
  });
  closeModal.addEventListener("click", function () {
    modalEl.classList.remove("open");
    billInputs.forEach(elem => elem.value = '');
  });
  window.addEventListener("click", function (event) {
    if (event.target === modalEl) {
      modalEl.classList.remove("open");
      billInputs.forEach(elem => elem.value = '');
    }
  })
}