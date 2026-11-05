import GalleryClient from "./GalleryClient";
import { getProducts } from "../../../../utils/staticParams";

export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getProducts();

  return products.flatMap((product) =>
    (product.variants ?? []).map((variant) => ({
      productSlug: product.slug,
      variantSlug: variant.slug,
    }))
  );
}

export default function Page() {
  return <GalleryClient />;
}