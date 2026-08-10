import { formatNumber } from "./format";

export const calculateRepayments = (data) => {
  if (!data) return null;
  let repayments = { monthly: "", total: "" };

  const { mortgage_amount, mortgage_term, interest_rate } = data;

  const n = Number(mortgage_term) * 12;
  const r = Number(interest_rate) / 12 / 100;

  if (data.mortgage_type === "repayment") {
    repayments.monthly =
      Number(mortgage_amount) *
      ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    repayments.total = Number(repayments.monthly) * n;

    repayments.monthly = formatNumber(Number(repayments.monthly));
    repayments.total = formatNumber(Number(repayments.total));
  }

  if (data.mortgage_type === "interest-only") {
    repayments.monthly = Number(mortgage_amount) * r;
    repayments.total = Number(repayments.monthly) * n;

    repayments.monthly = formatNumber(Number(repayments.monthly));
    repayments.total = formatNumber(Number(repayments.total));
  }

  return repayments;
};
