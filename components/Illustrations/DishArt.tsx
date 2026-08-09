import Image from "next/image";
import { Food } from "@/types/food";
import { getPhotoSrc } from "./photoRegistry";

interface DishArtProps {
  food: Food;
  size?: number;
}

export function hasDishArt(foodId: string): boolean {
  return getPhotoSrc(foodId) !== null;
}

export function DishArt({ food, size = 120 }: DishArtProps) {
  const photoSrc = getPhotoSrc(food.id);

  if (photoSrc) {
    return (
      <div
        className="relative overflow-hidden rounded-full ring-4 ring-white/70 shadow-inner"
        style={{ width: size, height: size }}
      >
        <Image
          src={photoSrc}
          alt={food.name}
          fill
          sizes={`${size}px`}
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <span className="block leading-none" style={{ fontSize: size * 0.6 }}>
      {food.emoji}
    </span>
  );
}
