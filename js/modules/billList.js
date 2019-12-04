import { bills } from '../data/bills.js';

const BillList = ( _ => {
  // cache the DOM
  const billListEl = document.querySelector(".monthly__expense-details");

  const init = _ => {
    render();
  }

  const render = _ => {
    let markup = "";

    bills.forEach((billObj, index) => {
      markup += `
        <tr>
          <td class="monthly__expense-date">${billObj.date}</td>
          <td class="monthly__expense-name">${billObj.name}</td>
          <td class="monthly__expense-amount">${billObj.amount}</td>
          <td><button class="btn btn-outline-success">Pay</button></td>
        </tr>
      `;
    });

    billListEl.innerHTML = markup;
  }
  return {
    init
  };
})();

export default BillList;