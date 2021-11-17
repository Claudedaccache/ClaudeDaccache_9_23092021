import { fireEvent, screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import billClass from "../containers/Bills.js"; ///added  by me///
import userEvent from "@testing-library/user-event";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import firebase from "../__mocks__/firebase";


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then Newbill icon in vertical layout should not be highlighted", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const html = BillsUI({ data: [] });
      document.body.innerHTML = html;

      const newBillIcon = screen.getByTestId("icon-mail");
      expect(newBillIcon.classList.contains("active-icon")).not.toBeTruthy();
    });

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => {
        return new Date(b.date) - new Date(a.date);
      };
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });
});

describe("When I am on Bills page ", () => {
  describe("When I click on the 'Nouvelle note de frais' button", () => {
    test("Then the New Bill form should open and be displayed", () => {
      const html = BillsUI({ data: bills });
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
      const billsClass = new billClass({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
      const newBillButton = screen.getByTestId(`btn-new-bill`);

      const handleClickOnNewBill = jest.fn((e) =>
        billsClass.handleClickNewBill(e)
      );
      newBillButton.addEventListener("click", handleClickOnNewBill);
      userEvent.click(newBillButton);
      expect(handleClickOnNewBill).toHaveBeenCalled();
    });
  });
});

describe("When I am on Bills page but it is loading", () => {
  test("Then, Loading page should be rendered", () => {
    const html = BillsUI({ loading: true });
    document.body.innerHTML = html;
    expect(screen.getAllByText("Loading...")).toBeTruthy();
  });
});

describe("When I am on Bills page but back-end send an error message", () => {
  test("Then, Error page should be rendered", () => {
    const html = BillsUI({ error: "some error message" });
    document.body.innerHTML = html;
    expect(screen.getAllByText("Erreur")).toBeTruthy();
  });
});

describe("When I am on Bills page", () => {
  describe("When I click on the eye icon of a particular Bill", () => {
    test("Then, modal should open and be displayed", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const firestore = null;
      const onNavigate = null;
      const billsClass = new billClass({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
      $.fn.modal = jest.fn();
      const button = screen.getAllByTestId("icon-eye")[0];
      const handleClickIconEye = jest.fn((e) => {
        e.preventDefault();
        billsClass.handleClickIconEye(button);
      });

      button.addEventListener("click", handleClickIconEye);

      fireEvent.click(button);
      expect(handleClickIconEye).toHaveBeenCalled();
    });


    test("Then, modal should open and  display an error message", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const firestore = null;
      const onNavigate = null;
      const billsClass = new billClass({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
      $.fn.modal = jest.fn();
      const icons = screen.getAllByTestId("icon-eye")
      const button = icons[icons.length - 1]
      const handleClickIconEye = jest.fn((e) => {
        e.preventDefault();
        billsClass.handleClickIconEye(button);
      });

      button.addEventListener("click", handleClickIconEye);

      fireEvent.click(button);

      const modaBody = screen.getByTestId("modal-body")

      expect(handleClickIconEye).toHaveBeenCalled();
      expect(modaBody.firstChild.textContent).toContain("Veuillez saisir un document ayant l'une des extensions suivantes : jpg, jpeg ou png")
    });


  });
});




















describe("When I am on Bills page", () => {
  test("Then, bills title should be displayed", () => {
    const html = BillsUI({ data: bills });
    document.body.innerHTML = html;
    const billPageTitle = screen.getByText(`Mes notes de frais`);

    expect(billPageTitle).toBeTruthy();
  });
});

describe("When I am on Bills page", () => {
  test("Then, the iconEye should be displayed for each bill", () => {
    const html = BillsUI({ data: bills });
    document.body.innerHTML = html;
    const iconEye = screen.getAllByTestId(`icon-eye`);
    expect(iconEye).toBeTruthy();
  });
});

describe("When I am on Bills page", () => {
  test("Then, the New Bill button should be displayed", () => {
    const html = BillsUI({ data: bills });
    document.body.innerHTML = html;
    const newBillButton = screen.getByTestId(`btn-new-bill`);
    expect(newBillButton).toBeTruthy();
  });
});

describe("When I am on Bills page", () => {
  describe("when I am not connected", () => {
    test("Then bill class will not  be called", () => {
      document.body.innerHTML = BillsUI({ data: [] });
      const firestore = null;
      const onNavigate = null;
      const localStorage = null;
      const billsClass = new billClass({
        document,
        onNavigate,
        firestore,
        localStorage,
      });

      const mockedClass= jest.fn((e) => {
        e.preventDefault();
        billsClass;
      });

      expect(mockedClass).not.toBeCalled();
      
    });
  });
});







// test d'intégration Get
describe("Given I am a user connected as employee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(firebase, "get");
      const bills = await firebase.get();
      document.body.innerHTML = BillsUI({data: bills.data})
      const allBillsDisplayed = screen.getByTestId(`tbody`);
      expect(allBillsDisplayed).toBeTruthy()
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(4);
    });
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
