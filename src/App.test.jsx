import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

const renderApp = () => render(<App />);

const fillMortgageForm = async ({
  amount = "",
  term = "",
  rate = "",
  mortgageType,
  user = userEvent.setup(),
} = {}) => {
  const amountInput = screen.getByLabelText(/mortgage amount/i);
  const termInput = screen.getByLabelText(/mortgage term/i);
  const rateInput = screen.getByLabelText(/interest rate/i);

  await user.clear(amountInput);
  await user.clear(termInput);
  await user.clear(rateInput);

  if (amount !== "") {
    await user.type(amountInput, String(amount));
  }

  if (term !== "") {
    await user.type(termInput, String(term));
  }

  if (rate !== "") {
    await user.type(rateInput, String(rate));
  }

  if (mortgageType) {
    await user.click(screen.getByLabelText(new RegExp(mortgageType, "i")));
  }

  return {
    amountInput,
    termInput,
    rateInput,
    calculateBtn: screen.getByRole("button", { name: /calculate repayments/i }),
  };
};

describe("form validation", () => {
  it("renders heading", () => {
    renderApp();
    expect(screen.getByText("Mortgage Calculator")).toBeInTheDocument();
  });

  it("renders calculator controls", () => {
    const { container } = renderApp();
    const inputs = container.querySelectorAll("input:not([type='hidden'])");
    const buttons = screen.getAllByRole("button");

    expect(inputs.length).toBeGreaterThanOrEqual(5);
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("shows error messages if the form is submitted empty", async () => {
    const user = userEvent.setup();
    renderApp();
    const { calculateBtn } = await fillMortgageForm({ user });

    await user.click(calculateBtn);

    const inputNumbersErrors = screen.getAllByText("This field is required");
    const mortgageTypeError = screen.getByText("Please select a mortgage type");

    inputNumbersErrors.forEach((error) => {
      expect(error).toBeInTheDocument();
    });
    expect(mortgageTypeError).toBeInTheDocument();
  });

  it("does not submit the form when the mortgage amount is invalid", async () => {
    const { container } = renderApp();
    const form = container.querySelector("form");
    const submitSpy = vi.fn((event) => event.preventDefault());
    form?.addEventListener("submit", submitSpy);

    const user = userEvent.setup();
    const invalidValues = ["-1", "0", "10.5", "5,5"];
    const invalidRate = "-1";

    for (const value of invalidValues) {
      await fillMortgageForm({ amount: value, rate: invalidRate, user });
      await user.click(
        screen.getByRole("button", { name: /calculate repayments/i }),
      );

      expect(submitSpy).not.toHaveBeenCalled();
    }
  });

  it("requires the selection of a loan type", async () => {
    const user = userEvent.setup();
    renderApp();
    const { calculateBtn } = await fillMortgageForm({
      amount: "300000",
      term: "25",
      rate: "5.25",
      user,
    });

    await user.click(calculateBtn);

    expect(
      screen.getByText("Please select a mortgage type"),
    ).toBeInTheDocument();
  });
});

describe("calculations logic", () => {
  it("correctly calculates monthly payments for a repayment loan", async () => {
    const user = userEvent.setup();
    renderApp();
    const { calculateBtn } = await fillMortgageForm({
      amount: "300000",
      term: "25",
      rate: "5.25",
      mortgageType: "repayment",
      user,
    });

    await user.click(calculateBtn);

    expect(screen.getByText("£1,797.74")).toBeInTheDocument();
    expect(screen.getByText("£539,322.94")).toBeInTheDocument();
  });

  it("correctly calculates monthly payments for an interest-only loan", async () => {
    const user = userEvent.setup();
    renderApp();
    const { calculateBtn } = await fillMortgageForm({
      amount: "300000",
      term: "25",
      rate: "5.25",
      mortgageType: "interest only",
      user,
    });

    await user.click(calculateBtn);

    expect(screen.getByText("£1,312.50")).toBeInTheDocument();
    expect(screen.getByText("£393,750.00")).toBeInTheDocument();
    expect(screen.getByText("Your results")).toBeInTheDocument();
  });
});

describe("clear all and UI states", () => {
  it("resets all the fields and shows the empty results state", async () => {
    const user = userEvent.setup();
    renderApp();
    const { calculateBtn } = await fillMortgageForm({
      amount: "300000",
      term: "25",
      rate: "5.25",
      mortgageType: "repayment",
      user,
    });

    await user.click(calculateBtn);
    await user.click(screen.getByRole("button", { name: /clear all/i }));

    expect(screen.getByText("Results shown here")).toBeInTheDocument();
    expect(screen.getByLabelText(/mortgage amount/i).value).toBe("");
    expect(screen.getByLabelText(/mortgage term/i).value).toBe("");
    expect(screen.getByLabelText(/interest rate/i).value).toBe("");
    expect(screen.getByLabelText(/repayment/i)).not.toBeChecked();
  });

  it("ensures that only one radio button can be checked", async () => {
    const user = userEvent.setup();
    renderApp();
    const repaymentRadio = screen.getByLabelText(/repayment/i);
    const interestRadio = screen.getByLabelText(/interest only/i);

    await user.click(repaymentRadio);
    expect(interestRadio).not.toBeChecked();

    await user.click(interestRadio);
    expect(repaymentRadio).not.toBeChecked();
  });
});
