
"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import ProductShowcase from "../../../components/productDetail/ProductShowcase";
import TextureShowcase from "../../../components/productDetail/TextureShowcase";
import RelatedProducts from "../../../components/productDetail/RelatedProducts";

import {
  getProductDetailRequest,
} from "../../../redux/ProductDetail/actions";

export default function ProductDetail() {
  const params = useParams();
  const dispatch = useDispatch();

  const slug = params?.slug;

  const {
    loading,
    data: product,
    error,
  } = useSelector((state) => state.ProductDetail);

  useEffect(() => {
    if (slug) {
      console.log("Product slug:", slug);

      dispatch(getProductDetailRequest(slug));
    }
  }, [dispatch, slug]);

  if (loading) {
    return (
      <div className="productDetailLoading">
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="productDetailError">
        {error}
      </div>
    );
  }

  if (!product) {
    return null;
  }

  console.log("Product API data:", product);

  return (
    <>
      <ProductShowcase
        variants={product.variants || []}
      />

      <TextureShowcase
        varietiesSection={product.varieties_section || null}
      />

      <RelatedProducts
        items={product.related || []}
      />
    </>
  );
}

