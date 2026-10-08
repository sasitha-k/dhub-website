const lkr = new Intl.NumberFormat("en-LK");

export function formatLkr(amount: number) {
  return `LKR ${lkr.format(amount)}`;
}
