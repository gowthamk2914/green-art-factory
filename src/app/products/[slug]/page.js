import ProductDetailClient from "./ProductDetailClient";
import { getProducts } from "../../../utils/staticParams";

export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default function Page() {
  return <ProductDetailClient />;
}