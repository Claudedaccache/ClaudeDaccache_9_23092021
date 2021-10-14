import { ROUTES_PATH } from "../constants/routes.js";
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";
// import { bills } from "../fixtures/bills.js";

export default class {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.firestore = firestore;
    const buttonNewBill = document.querySelector(
      `button[data-testid="btn-new-bill"]`
    );
    if (buttonNewBill)
      buttonNewBill.addEventListener("click", this.handleClickNewBill);
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
    if (iconEye)
      iconEye.forEach((icon) => {
        icon.addEventListener("click", (e) => this.handleClickIconEye(icon));
      });
    new Logout({ document, localStorage, onNavigate });
  }

  handleClickNewBill = (e) => {
    this.onNavigate(ROUTES_PATH["NewBill"]);
  };

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url");
    // const imgWidth = Math.floor($("#modaleFile").width() * 0.5);          ///removed ///
    $("#modaleFile").find(".modal-body").html(
      `<div style='text-align: center;'><img width=100% src=${billUrl} /></div>` ///used 100% instead of ${imgWidth}///
    );
    $("#modaleFile").modal("show");
  };

  // not need to cover this function by tests
  getBills = () => {
    const userEmail = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).email
      : "";
    if (this.firestore) {
      return this.firestore
        .bills()
        .get()
        .then((snapshot) => {
          const unsortedBills = snapshot.docs.map((doc) => doc.data());
          let allFilteredBills = unsortedBills.filter(
            (bill) => bill.email === userEmail
          );
          let filtredBills = allFilteredBills.filter(
            (bill) => bill.date !== "" && new Date(bill.date) < Date.now() && new Date(bill.date) > new Date("1900")
          );
          const antiChrono = (a, b) => {
            return new Date(b.date) - new Date(a.date)};

          filtredBills.sort(antiChrono);
          const bills = filtredBills.map((bill) => {
            console.log(formatDate(bill.date));
            try {
              return {
                ...bill,
                date: formatDate(bill.date),
                status: formatStatus(bill.status),
              };
            } catch (e) {
              // if for some reason, corrupted data was introduced, we manage here failing formatDate function
              // log the error and return unformatted date in that case
              // console.log(e,'for',doc.data())
              return {
                ...bill,
                date: bill.date,
                status: formatStatus(bill.status),
              };
            }
          });
          console.log("length", bills.length);
          return bills;
        })
        .catch((error) => error);
    }
  };
}
