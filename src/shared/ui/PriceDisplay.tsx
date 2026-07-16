import { useTranslations } from "next-intl";

export interface PriceDisplayProps {
  price: number;
  discountedPrice?: number;
  className?: string;
}

export function PriceDisplay({
  price,
  discountedPrice,
  className = "",
}: PriceDisplayProps) {
  const t = useTranslations("product");
  const hasDiscount = discountedPrice !== undefined && discountedPrice < price;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-body font-semibold text-primary">
        {t("priceValue", { amount: hasDiscount ? discountedPrice! : price })}
      </span>
      {hasDiscount && (
        <span className="text-body-sm text-muted-foreground line-through">
          {t("priceValue", { amount: price })}
        </span>
      )}
    </div>
  );
}
