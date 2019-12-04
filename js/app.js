import BillList from './modules/billList.js';
// Cache the DOM
const billListEl = document.querySelector(".monthly__expense-details");

if(billListEl){
  BillList.init();
}