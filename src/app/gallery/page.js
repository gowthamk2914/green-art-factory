import GalleryHero from "../../components/gallery/GalleryHero";
import GalleryList from "../../components/gallery/GalleryList";
import GalleryRelatedImages from "../../components/gallery/GalleryRelatedImages";

export default function Gallery() {
  return (
    <>
      <GalleryHero />
      <GalleryList />
      <GalleryRelatedImages />
    </>
  );
}