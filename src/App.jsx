import React, { useState } from "react";

function App() {
  const [enteredValue, setEnteredValue] = useState({
    amount: "",
    term: "",
    interestRate: "",
    mortgageType: "",
  });

  const [inputError, setInputError] = useState({
    amount: false,
    term: false,
    interestRate: false,
    mortgageType: false,
  });

  const [results, setResults] = useState({ monthly: null, total: null });

  function handleSubmit(event) {
    event.preventDefault();

    if (!enteredValue.amount) {
      setInputError((prevValue) => ({ ...prevValue, amount: true }));
    }

    if (!enteredValue.term) {
      setInputError((prev) => ({ ...prev, term: true }));
    }

    if (!enteredValue.interestRate) {
      setInputError((prev) => ({ ...prev, interestRate: true }));
    }

    if (!enteredValue.mortgageType) {
      setInputError((prev) => ({ ...prev, mortgageType: true }));
    }

    if (Object.values(inputError).some((value) => value === true)) return;

    setResults(calculateRepayments());
  }

  function calculateRepayments() {
    let repayments = { monthly: "", total: "" };

    const { amount, term, interestRate } = enteredValue;
    const n = Number(term) * 12;
    const r = Number(interestRate) / 12 / 100;

    if (enteredValue.mortgageType === "repayment") {
      repayments.monthly =
        Number(amount) * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      repayments.total = Number(repayments.monthly) * n;

      repayments.monthly = formatResult(Number(repayments.monthly));
      repayments.total = formatResult(Number(repayments.total));
    }

    if (enteredValue.mortgageType === "interestOnly") {
      repayments.monthly = Number(amount) * r;
      repayments.total = Number(repayments.monthly) * n;

      repayments.monthly = formatResult(Number(repayments.monthly));
      repayments.total = formatResult(Number(repayments.total));
    }

    return repayments;
  }

  function formatResult(number) {
    const formatted = new Intl.NumberFormat("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);

    return formatted;
  }

  // function formatAmount(value) {
  //   const number = Number(value);
  //   const formatted = new Intl.NumberFormat("en-US").format(number);
  //   return formatted;
  // }

  function handleInputChange(identifier, value) {
    setEnteredValue((prevValue) => ({ ...prevValue, [identifier]: value }));

    if (identifier === "mortgageType")
      setInputError((prev) => ({ ...prev, [identifier]: false }));
  }

  function handleCheckValue(identifier, value) {
    if (value && value >= 0)
      setInputError((prev) => ({ ...prev, [identifier]: false }));
  }

  return (
    <main className="md:rounded-[24px] overflow-clip lg:max-w-[1008px]">
      <section
        aria-labelledby="calculator-heading"
        className="bg-white py-8 px-6 lg:grid md:p-[40px] lg:grid-cols-2"
      >
        <div className="lg:pr-[40px] ">
          <header className="flex flex-col gap-[8px_0] mb-[24px] md:flex-row md:justify-between md:gap-0 md:mb-[40px]">
            <h1 id="calculator-heading">Mortgage Calculator</h1>
            <a href="" className="self-start hover:text-slate-900">
              Clear All
            </a>
          </header>
          <form onSubmit={handleSubmit}>
            <fieldset className="mb-[24px]">
              <legend className="mb-[12px]">Mortgage Amount</legend>
              <div className="relative flex items-center">
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={enteredValue.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  onInput={(e) => handleCheckValue("amount", e.target.value)}
                  className={
                    inputError.amount
                      ? "error-input w-full pl-[60px] pr-[16px] "
                      : "w-full pl-[60px] pr-[16px] "
                  }
                />
                <label
                  htmlFor="amount"
                  className={
                    inputError.amount
                      ? "error-label absolute top-[1px] left-[1px] flex center-both bg-slate-100 w-[43px] h-[46px] rounded-l-[4px]"
                      : "absolute top-[1px] left-[1px] flex center-both bg-slate-100 w-[43px] h-[46px] rounded-l-[4px]"
                  }
                >
                  £
                </label>
              </div>
              <span
                className={
                  inputError.amount
                    ? "block error-msg mt-[12px]"
                    : "hidden error-msg mt-[12px]"
                }
              >
                this field is required
              </span>
            </fieldset>
            <div className="flex flex-col gap-[24px_0] mb-[24px] md:flex md:flex-row md:gap-[0_24px]">
              <fieldset className="basis-1/2">
                <legend className="mb-[12px]">Mortgage Term</legend>
                <div className="relative">
                  <input
                    type="number"
                    id="term"
                    name="term"
                    value={enteredValue.term}
                    onChange={(e) => handleInputChange("term", e.target.value)}
                    onInput={(e) => handleCheckValue("term", e.target.value)}
                    className={
                      inputError.term
                        ? "error-input w-full pl-[16px] pr-[96px]"
                        : "w-full pl-[16px] pr-[96px]"
                    }
                  />
                  <label
                    htmlFor="term"
                    className={
                      inputError.term
                        ? "error-label absolute top-[1px] right-[1px] flex center-both bg-slate-100 w-[79px] h-[46px] rounded-r-[4px] "
                        : "absolute top-[1px] right-[1px] flex center-both bg-slate-100 w-[79px] h-[46px] rounded-r-[4px] "
                    }
                  >
                    years
                  </label>
                  <span
                    className={
                      inputError.term
                        ? "block error-msg mt-[12px]"
                        : "hidden error-msg mt-[12px]"
                    }
                  >
                    this field is required
                  </span>
                </div>
              </fieldset>
              <fieldset className="basis-1/2">
                <legend className="mb-[12px]">Interest Rate</legend>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    id="interest"
                    name="interest"
                    value={enteredValue.interestRate}
                    onChange={(e) =>
                      handleInputChange("interestRate", e.target.value)
                    }
                    onInput={(e) =>
                      handleCheckValue("interestRate", e.target.value)
                    }
                    className={
                      inputError.interestRate
                        ? "error-input w-full pl-[16px] pr-[66px] "
                        : "w-full pl-[16px] pr-[66px] "
                    }
                  />
                  <label
                    htmlFor="interest"
                    className={
                      inputError.interestRate
                        ? "error-label absolute top-[1px] right-[1px] flex center-both bg-slate-100 w-[50px] h-[46px] rounded-r-[4px]  "
                        : "absolute top-[1px] right-[1px] flex center-both bg-slate-100 w-[50px] h-[46px] rounded-r-[4px]  "
                    }
                  >
                    %
                  </label>
                  <span
                    className={
                      inputError.interestRate
                        ? "block error-msg mt-[12px]"
                        : "hidden error-msg mt-[12px]"
                    }
                  >
                    this field is required
                  </span>
                </div>
              </fieldset>
            </div>
            <fieldset className="mb-[24px] md:mb-[40px] ">
              <legend className="mb-[12px]">Mortgage Type</legend>
              <div className="flex items-center gap-x-[16px] cursor-pointer border border-slate-500 rounded-[4px] h-[48px] px-[16px] mb-[12px] transition hover:border-lime ">
                <input
                  id="repayment"
                  type="radio"
                  name="mortgageType"
                  value="repayment"
                  checked={enteredValue.mortgageType === "repayment"}
                  onChange={(e) =>
                    handleInputChange("mortgageType", e.target.value)
                  }
                />
                <label htmlFor="repayment" className="w-full cursor-pointer">
                  Repayment
                </label>
              </div>
              <div className="flex items-center gap-x-[16px] cursor-pointer border border-slate-500 rounded-[4px] h-[48px] px-[16px] transition hover:border-lime ">
                <input
                  id="interestOnly"
                  type="radio"
                  name="mortgageType"
                  value="interestOnly"
                  checked={enteredValue.mortgageType === "interestOnly"}
                  onChange={(e) =>
                    handleInputChange("mortgageType", e.target.value)
                  }
                />
                <label htmlFor="interestOnly" className="w-full cursor-pointer">
                  Interest Only
                </label>
              </div>
              <span
                className={
                  inputError.mortgageType
                    ? "block error-msg mt-[12px]"
                    : "hidden error-msg mt-[12px]"
                }
              >
                this field is required
              </span>
            </fieldset>
            <button
              type="submit"
              className="flex center-both gap-x-[12px] bg-lime w-full h-[56px] rounded-full transition hover:bg-lime-hover mb-8 md:max-w-[314px] lg:mb-0 md:mb-[40px] "
            >
              <img
                src="assets/images/icon-calculator.svg"
                alt="calculator icon"
              />
              Calculate Repayments
            </button>
          </form>
        </div>

        {!results.monthly && (
          <section
            aria-labelledby="empty-results-heading"
            className="bg-slate-900 mx-[-24px] mb-[-32px] px-[24px] py-[32px] md:mx-[-40px] md:mb-[-40px] lg:my-[-40px] lg:ml-0 lg:flex lg:flex-col lg:justify-center lg:rounded-bl-[80px] lg:p-[40px]"
          >
            <div className="flex center-both mb-[16px] ">
              <img
                src="assets/images/illustration-empty.svg"
                alt="empty illustration"
              />
            </div>
            <h2
              id="empty-results-heading"
              className="text-white text-center mb-[16px]"
            >
              Results shown here
            </h2>
            <p className="text-center max-w-[327px] mx-auto md:max-w-max">
              Complete the form and click “calculate repayments” to see what
              your monthly repayments would be.
            </p>
          </section>
        )}

        {results.monthly && (
          <section
            aria-labelledby="results-heading"
            className="bg-slate-900 text-white mx-[-24px] mb-[-32px] px-[24px] py-[32px] md:mb-[-40px] md:mx-[-40px] md:p-[40px] lg:my-[-40px] lg:ml-0 lg:rounded-bl-[80px]"
          >
            <h2 id="results-heading" className="mb-[16px]">
              Your results
            </h2>
            <p className="mb-[24px] md:mb-[40px] ">
              Your results are shown below based on the information you
              provided. To adjust the results, edit the form and click
              “calculate repayments” again.
            </p>

            <article className="px-[16px] py-[24px] bg-black/25 rounded-[8px] shadow-[inset_0_4px_0_0_var(--color-lime)] md:p-[32px] ">
              <h3 className="mb-[8px]">Your monthly repayments</h3>
              <p className="text-lime text-[2.5rem] font-bold ">
                {`£${results.monthly}`}
              </p>

              <hr className="border-none h-[1px] bg-hr my-[16px] " />

              <h3 className="mb-[8px]">Total you'll repay over the term</h3>
              <p className="text-white text-[1.5rem] font-bold leading-[125%]">
                {`£${results.total}`}
              </p>
            </article>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
