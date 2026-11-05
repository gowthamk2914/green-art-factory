import BlogDetailHero from "../../../components/blogsDetail/BlogDetailHero";
import BlogDetailBody from "../../../components/blogsDetail/BlogDetailBody";
import RelatedArticles from "../../../components/blogsDetail/RelatedArticles";
import CommonContactEnquiry from "../../../components/common/CommonContactEnquiry";
import { getBlogSlugs } from "../../../utils/staticParams";

// Only the blogs that exist at build time get a page
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function BlogDetailPage() {
  return (
    <>
      <BlogDetailHero />
      <BlogDetailBody />
      <RelatedArticles />
      <CommonContactEnquiry />
    </>
  );
}