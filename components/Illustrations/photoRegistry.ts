export const PHOTO_REGISTRY: Record<string, string> = {
  "margherita-pizza": "margherita-pizza",
  "farmhouse-pizza": "margherita-pizza",
  "pepperoni-pizza": "margherita-pizza",
  "cheese-burst-pizza": "margherita-pizza",
  "chicken-biryani": "chicken-biryani",
  "mutton-biryani": "chicken-biryani",
  "veg-biryani": "chicken-biryani",
  "egg-biryani": "chicken-biryani",
  "hyderabadi-biryani": "chicken-biryani",
  "big-mac": "big-mac",
  cheeseburger: "big-mac",
  "veg-burger": "big-mac",
  "chicken-burger": "big-mac",
  "large-fries": "large-fries",
  "medium-fries": "large-fries",
  "veg-momos": "veg-momos",
  "chicken-momos": "veg-momos",
  "masala-dosa": "masala-dosa",
  "plain-dosa": "masala-dosa",
  "oreo-shake": "oreo-shake",
  "cold-coffee": "cold-coffee",
  "paneer-butter-masala": "paneer-butter-masala",
};

export function getPhotoSrc(foodId: string): string | null {
  const key = PHOTO_REGISTRY[foodId];
  return key ? `/images/foods/${key}.jpg` : null;
}

export function getPhotoCreditKey(foodId: string): string | null {
  return PHOTO_REGISTRY[foodId] ?? null;
}
