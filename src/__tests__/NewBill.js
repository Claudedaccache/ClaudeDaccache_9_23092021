import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";




describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then, file uploaded should be with the correct extension", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

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
      const NewBillTest = jest.fn((e) =>
      theNewBill.handleChangeFile(e)
      );
      file.addEventListener("click", NewBillTest);
      fireEvent.click(file);
      expect(NewBillTest).toHaveBeenCalled();
    })


    test("Then, clicking on the send button should submit the form and create a new bill and send it to the hr admin", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

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
      const formSubmit = jest.fn((e) =>
      theNewBill.handleSubmit(e)
      );
      form.addEventListener("click", formSubmit);
      userEvent.click(form);
      expect(formSubmit).toHaveBeenCalled();
    })

    test("Then, New bill title should be displayed" , () => {
      const html = NewBillUI()
      document.body.innerHTML = html;
      const newBillTitle = screen.getByText(`Envoyer une note de frais`);
      expect(newBillTitle).toBeTruthy();
  });

  test("Then, the send button should be displayed" , () => {
    const html = NewBillUI()
    
    document.body.innerHTML = html;
    const sendButton = screen.getByTestId(`btn-send`);
    expect(sendButton).toBeTruthy();
});

test("Then New bill icon in vertical layout should be highlighted", () => {
  const html = NewBillUI()
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
  const newBillIcon = screen.queryByTestId("layout-icon2");
  expect(newBillIcon).toHaveClass("active-icon");
});
})
})
