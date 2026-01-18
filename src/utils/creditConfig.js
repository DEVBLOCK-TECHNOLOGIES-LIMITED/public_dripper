// Credit System Configuration
// This file centralizes all credit-related calculations and configurations

// Credit conversion rate: How many credits equal $1
export const CREDITS_PER_DOLLAR = 100;

// Calculate credits needed for a dollar amount
export const dollarToCredits = (dollars) => {
  return Math.ceil(parseFloat(dollars) * CREDITS_PER_DOLLAR);
};

// Calculate dollar value from credits
export const creditsToDollars = (credits) => {
  return (parseFloat(credits) / CREDITS_PER_DOLLAR).toFixed(2);
};

// Calculate credits needed for cart items
export const calculateCartCredits = (cartItems) => {
  if (!cartItems || cartItems.length === 0) return 0;
  const total = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price || 0),
    0,
  );
  return dollarToCredits(total);
};

// Check if user has enough credits for cart
export const hasEnoughCredits = (creditBalance, cartItems) => {
  const creditsNeeded = calculateCartCredits(cartItems);
  return creditBalance >= creditsNeeded;
};

// Calculate discount when paying with credits (optional bonus)
export const calculateCreditDiscount = (originalPrice, payingWithCredits) => {
  if (!payingWithCredits) return 0;
  // 5% discount when paying fully with credits
  return parseFloat(originalPrice) * 0.05;
};

// Calculate credits to be earned from a purchase (loyalty program)
export const calculateEarnedCredits = (purchaseTotal) => {
  // Earn 5 credits per $1 spent (5% back)
  return Math.floor(parseFloat(purchaseTotal) * 5);
};

// Format credits display
export const formatCredits = (credits) => {
  return Number(credits).toLocaleString();
};

// Credit packages with dynamic bonus calculation
export const CREDIT_PACKAGES = [
  { id: "starter", name: "Starter", price: 10, baseCredits: 1000, bonus: 0 },
  { id: "popular", name: "Popular", price: 25, baseCredits: 2500, bonus: 10 },
  {
    id: "bestvalue",
    name: "Best Value",
    price: 50,
    baseCredits: 5000,
    bonus: 20,
  },
  { id: "premium", name: "Premium", price: 100, baseCredits: 10000, bonus: 30 },
];

// Calculate total credits for a package (base + bonus)
export const getPackageCredits = (pkg) => {
  const bonusCredits = Math.floor(pkg.baseCredits * (pkg.bonus / 100));
  return pkg.baseCredits + bonusCredits;
};

// Get credits value text for product display
export const getProductCreditValue = (price) => {
  const credits = dollarToCredits(price);
  return `${formatCredits(credits)} credits`;
};

const creditSystem = {
  CREDITS_PER_DOLLAR,
  dollarToCredits,
  creditsToDollars,
  calculateCartCredits,
  hasEnoughCredits,
  calculateCreditDiscount,
  calculateEarnedCredits,
  formatCredits,
  CREDIT_PACKAGES,
  getPackageCredits,
  getProductCreditValue,
};

export default creditSystem;
