import ProjectGalleryClient from "./ProjectGalleryClient";
import { getProjectSlugs } from "../../../../utils/staticParams";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function Page() {
  return <ProjectGalleryClient />;
}