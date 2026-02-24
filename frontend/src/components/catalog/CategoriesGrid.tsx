import { CategoryCard } from "@/components/catalog/CategoryCard";
import {
  catalogCategoryCards as defaultCatalogCategoryCards,
  type CategoryCardData,
} from "@/data/catalog-categories";

interface CategoriesGridProps {
  categories?: CategoryCardData[];
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  const cards = categories ?? defaultCatalogCategoryCards;
  const [bedLinen, homeTextile, blankets, pillows, plaids, towels, boudoir] = cards;

  return (
    <div className="desktop:px-0 px-4 md:px-[39px]">
      <div className="desktop:mt-8 mx-auto mt-6 max-w-[1400px]">
        {/* Desktop layout */}
        <div className="desktop:flex desktop:flex-col desktop:gap-2 hidden">
          <div className="flex gap-2">
            <CategoryCard {...bedLinen} className="aspect-square w-1/2" />
            <CategoryCard {...homeTextile} className="aspect-square w-1/2" />
          </div>
          <div className="flex gap-2">
            <CategoryCard {...blankets} className="aspect-square w-1/3" />
            <CategoryCard {...pillows} className="aspect-square w-1/3" />
            <CategoryCard {...plaids} className="aspect-square w-1/3" />
          </div>
          <div className="flex gap-2">
            <CategoryCard {...towels} className="aspect-square w-1/3" />
            <CategoryCard {...boudoir} className="aspect-[2/1] w-2/3" />
          </div>
        </div>

        {/* Tablet layout */}
        <div className="desktop:hidden hidden md:flex md:flex-col md:gap-2">
          <div className="flex gap-2">
            <CategoryCard {...bedLinen} className="h-[350px] w-1/2" />
            <CategoryCard {...homeTextile} className="h-[350px] w-1/2" />
          </div>
          <div className="flex gap-2">
            <CategoryCard {...blankets} className="h-[280px] w-1/3" />
            <CategoryCard {...pillows} className="h-[280px] w-1/3" />
            <CategoryCard {...plaids} className="h-[280px] w-1/3" />
          </div>
          <div className="flex gap-2">
            <CategoryCard {...towels} className="h-[280px] w-1/3" />
            <CategoryCard {...boudoir} className="h-[280px] w-2/3" />
          </div>
        </div>

        {/* Mobile layout — порядок отличается от десктопа */}
        <div className="flex flex-col gap-1 md:hidden">
          <CategoryCard {...bedLinen} className="h-[216px] w-full" />
          <div className="flex gap-1">
            <CategoryCard {...pillows} className="h-[216px] w-1/2" />
            <CategoryCard {...plaids} className="h-[216px] w-1/2" />
          </div>
          <CategoryCard {...towels} className="h-[216px] w-full" />
          <div className="flex gap-1">
            <CategoryCard {...blankets} className="h-[216px] w-1/2" />
            <CategoryCard {...homeTextile} className="h-[216px] w-1/2" />
          </div>
          <CategoryCard {...boudoir} className="h-[216px] w-full" />
        </div>
      </div>
    </div>
  );
}
