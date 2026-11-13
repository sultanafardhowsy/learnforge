export const formatPrice = (price: number) =>
  price === 0
    ? "Free"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(iso),
  );

export const pluralize = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
