// Free Plan
const F_MAX_PRODUCTS = 10; 

// Basic Plan
const B_MAX_PRODUCTS = 50; 

// Standard Plan
const S_MAX_PRODUCTS = 200;

// Premium Plan (Unlimited)
const P_MAX_PRODUCTS = -1; 

const PLANS: Record<number, {name: string, maxProducts: number}> = {
  0: { name: "Free Plan", maxProducts: F_MAX_PRODUCTS },
  1: { name: "Basic Plan", maxProducts: B_MAX_PRODUCTS },
  2: { name: "Standard Plan", maxProducts: S_MAX_PRODUCTS },
  3: { name: "Premium Plan", maxProducts: P_MAX_PRODUCTS },
};

const getMaxProducts = (code: number): number => {
  return PLANS[code]?.maxProducts;
};

const getStringPlan = (code: number): string  => {
  return PLANS[code]?.name;
};

export { getMaxProducts, getStringPlan }