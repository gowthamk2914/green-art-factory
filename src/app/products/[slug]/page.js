
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

import {
  getProductDetailRelatedProductsRequest,
} from "../../../redux/ProductDetailRelatedProducts/actions";

export default function ProductDetail() {
  const params = useParams();
  const dispatch = useDispatch();

  const slug = params?.slug;

  const {
    loading,
    data: product,
    error,
  } = useSelector((state) => state.ProductDetail);

  const {
    data: relatedProductsData,
  } = useSelector(
    (state) => state.ProductDetailRelatedProducts
  );

  useEffect(() => {
    if (slug) {
      dispatch(getProductDetailRequest(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (product?.related?.length) {
      dispatch(
        getProductDetailRelatedProductsRequest(product.related)
      );
    }
  }, [dispatch, product?.id, product?.related]);

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
        relatedProductsData={relatedProductsData}
      />
    </>
  );
}
