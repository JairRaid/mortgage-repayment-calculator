import { formatNumber } from "./format";

export const calculateRepayments = (data) => {
  if (!data) return null;
  let repayments = { monthly: "", total: "" };

  const { mortgage_amount, mortgage_term, interest_rate } = data;

  const n = Number(mortgage_term) * 12;
  const r = Number(interest_rate) / 12 / 100;
  const amount = Number(mortgage_amount);

  if (data.mortgage_type === "repayment") {
    let monthly;
    if (r === 0) {
      monthly = amount / n;
    } else {
      monthly = amount * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    }

    const total = monthly * n;

    repayments.monthly = formatNumber(monthly);
    repayments.total = formatNumber(total);
  }

  if (data.mortgage_type === "interest-only") {
    const monthly = amount * r;
    const total = monthly * n + amount;

    repayments.monthly = formatNumber(monthly);
    repayments.total = formatNumber(total);
  }

  return repayments;
};
