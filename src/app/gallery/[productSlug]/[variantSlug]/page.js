"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { getGalleryRequest } from "../../../../../src/redux/Gallery/actions";
import GalleryHero from "../../../../components/gallery/GalleryHero";
import GalleryList from "../../../../components/gallery/GalleryList";
import GalleryRelatedImages from "../../../../components/gallery/GalleryRelatedImages";

export default function GalleryPage() {
  const { productSlug, variantSlug } = useParams();
  const dispatch = useDispatch();

  const loadedSlug = useSelector((state) => state.Gallery?.productSlug);
  const productPayload = useSelector((state) => state.Gallery?.data);
  const loading = useSelector((state) => state.Gallery?.loading);
  const error = useSelector((state) => state.Gallery?.error);

  // Fetch the product detail (which contains all its variants + images)
  // whenever the URL's productSlug changes. `loadedSlug` guards against
  // an unnecessary refetch if the user navigates between variants of the
  // SAME product (e.g. moss-walls -> moss-frames) — the data is already
  // in the store, we just re-pick the variant below.
  useEffect(() => {
    if (productSlug && productSlug !== loadedSlug) {
      dispatch(getGalleryRequest(productSlug));
    }
  }, [dispatch, productSlug, loadedSlug]);

  const product = productPayload?.data;

  const variant = useMemo(() => {
    if (!product?.variants) return null;
    return product.variants.find((v) => v.slug === variantSlug) ?? null;
  }, [product, variantSlug]);

  // Variant detail objects carry an `images` array (see the
  // /v1/products/:slug response); fall back to the single `image`
  // field if `images` isn't populated for some variant.
  const galleryImages = useMemo(() => {
    if (!variant) return [];
    const sources = variant.images?.length
      ? variant.images
      : variant.image
      ? [variant.image]
      : [];

    return sources.map((url, index) => ({
      slug: `${variant.slug}-${index}`,
      image: url,
      alt: variant.name,
    }));
  }, [variant]);

  if (loading && productSlug !== loadedSlug) {
    return <p className="portfolioPageStatus">Loading gallery…</p>;
  }

  if (error) {
    return <p className="portfolioPageStatus">Couldn&apos;t load this gallery.</p>;
  }

  if (product && !variant) {
    return <p className="portfolioPageStatus">This gallery could not be found.</p>;
  }

  return (
    <>
      <GalleryHero title={variant?.name} description={variant?.description} />
      <GalleryList images={galleryImages} title={variant?.name} />
      <GalleryRelatedImages
        product={product}
        currentVariantSlug={variant?.slug}
      />
    </>
  );
}