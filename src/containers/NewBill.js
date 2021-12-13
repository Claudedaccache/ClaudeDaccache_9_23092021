import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export function checkFile(fileName) {
  const sendBtn = document.getElementById("btn-send-bill");
  const ext = fileName.split(".").pop().toLowerCase(); /// got the extention to verify it///
  if ($.inArray(ext, ["png", "jpg", "jpeg"]) > -1) {
    sendBtn.disabled = false;
    return true;
  }
  sendBtn.disabled = true;
  return false;
}

export function checkDate(bill) {
  const sendBtn = document.getElementById("btn-send-bill");

  if (bill !== "" && new Date(bill) < Date.now()) {
    sendBtn.disabled = false;
    return true;
  }
  sendBtn.disabled = true;
  return false;
}

export default class NewBill {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.firestore = firestore;
    const formNewBill = this.document.querySelector(
      `form[data-testid="form-new-bill"]`
    );
    formNewBill.addEventListener("submit", this.handleSubmit);
    const file = this.document.querySelector(`input[data-testid="file"]`);
    file.addEventListener("change", this.handleChangeFile);
    const BillDate = this.document.querySelector(
      `input[data-testid="datepicker"]`
    );
    BillDate.addEventListener("change", this.handleBillDate);
    this.fileUrl = null;
    this.fileName = null;
    new Logout({ document, localStorage, onNavigate });
  }
  handleChangeFile = (e) => {
    const file = this.document.querySelector(`input[data-testid="file"]`)
      .files[0];
    const filePath = e.target.value.split(/\\/g);
    const fileName = filePath[filePath.length - 1];
    if (checkFile(fileName)) {
      this.firestore.storage
        .ref(`justificatifs/${fileName}`)
        .put(file)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((url) => {
          this.fileUrl = url;
          this.fileName = fileName;
          return true;
        });
    } else {
      alert("Wrong extension!!");
      e.preventDefault;
      return false;
    }
  };

  handleBillDate = (e) => {
    const billDateValue = e.target.value;
    console.log(billDateValue);
    if (checkDate(billDateValue)) {
      return true;
    } else {
      alert("Wrong Date format !!");
      e.preventDefault;
      return false;
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const sendBtn = document.getElementById("btn-send-bill");

    const email = JSON.parse(localStorage.getItem("user")).email;
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(
        e.target.querySelector(`input[data-testid="amount"]`).value
      ),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct:
        parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
        20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
        .value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending",
    };
    if (bill && bill.fileName !== null) {
      /// added by me///
      sendBtn.disabled = false;
      this.createBill(bill);
    } else {
      sendBtn.disabled = true;
      e.preventDefault();
      alert("Form cannot be submitted, Wrong extension!!");
    }
  };

  // not need to cover this function by tests
  createBill = (bill) => {
    if (this.firestore) {
      this.firestore
        .bills()
        .add(bill)
        .then(() => {
          this.onNavigate(ROUTES_PATH["Bills"]);
        })
        .catch((error) => error);
    }
  };
}
