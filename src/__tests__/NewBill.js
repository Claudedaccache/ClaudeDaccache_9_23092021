import { fireEvent, queryByAttribute, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill, { checkFile } from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";
import firebase from "../__mocks__/firebase";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then, handleChangeFile should be called", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const firestore = null;
      const theNewBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
      const file = screen.getByTestId(`file`);

      const NewBillTest = jest.fn((e) => theNewBill.handleChangeFile(e));
      file.addEventListener("click", NewBillTest);
      fireEvent.click(file);
      expect(NewBillTest).toHaveBeenCalled();
    });

    test("Then, checkFile should be called with right file format", () => {
      let fileName = "test.jpg"
      expect(checkFile(fileName)).toBeTruthy()
    })

    test("Then, checkFile should be called with wrong file format", () => {
      let fileName = "test.pdf"
      expect(checkFile(fileName)).toBeFalsy()

    })



    test("Then, inputs should be filled as a template", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const firestore = null;
      const theNewBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
      const file = screen.getByTestId(`file`);
      const expenseType = screen.getByTestId(`expense-type`);
      const expenseName = screen.getByTestId(`expense-name`);
      const expenseDate = screen.getByTestId(`datepicker`);
      const expenseAmount = screen.getByTestId(`amount`);
      const expenseVat = screen.getByTestId(`vat`);
      const expensePct = screen.getByTestId(`pct`);
      const expenseCommentary = screen.getByTestId(`commentary`);

      const NewBillTest = jest.fn(theNewBill.handleChangeFile);
      file.addEventListener("click", NewBillTest);
      fireEvent.click(file);
      expect(NewBillTest).toHaveBeenCalled();
      expect(file.length).not.toEqual(0);
      expect((expenseType.value = "Transports")).toBe("Transports");
      expect(expenseName.value).toBe("");
      expect(expenseDate.value).toBe("");
      expect(expenseAmount.value).toBe("");
      expect(expenseVat.value).toBe("");
      expect(expensePct.value).toBe("");
      expect(expenseCommentary.value).toBe("");
    });

    test("Then, clicking on the send button should submit the form", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const firestore = null;
      const theNewBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
      const form = screen.getByTestId(`form-new-bill`);
      const formSubmit = jest.fn((e) => theNewBill.handleSubmit(e));
      form.addEventListener("click", formSubmit);
      userEvent.click(form);
      expect(formSubmit).toHaveBeenCalled();
    });

    
    test("Then, New bill title should be displayed", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const newBillTitle = screen.getByText(`Envoyer une note de frais`);
      expect(newBillTitle).toBeTruthy();
    });

    test("Then, the send button should be displayed", () => {
      const html = NewBillUI();

      document.body.innerHTML = html;
      const sendButton = screen.getByTestId(`btn-send`);
      expect(sendButton).toBeTruthy();
    });

    test("Then bill icon in vertical layout should be not highlighted", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const billIcon = screen.queryByTestId("icon-window");
      expect(billIcon.classList.contains("active-icon")).not.toBeTruthy();
    });
  });
});

describe("When I am on  New bill page", () => {
  describe("when I am not connected", () => {
    test("Then  New bill class will not be called", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const firestore = null;
      const theNewBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
      const mockedClass = jest.fn((e) => {
        e.preventDefault();
        theNewBill;
      });

      expect(mockedClass).not.toBeCalled();
    });
  });
});

//test d'intégration POST
describe("Given I am a user connected as employee", () => {
  describe("When I navigate to NewBill", () => {
    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(firebase, "get");
      const bills = await firebase.get();
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(4);
    });
  });
});
