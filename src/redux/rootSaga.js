import { all } from "redux-saga/effects";

import ProductsSaga from "./Products/saga";
import FeaturedProjectsSaga from "./FeaturedProjects/saga";
import TestimonialsSaga from "./Testimonials/saga";
import PartnersSaga from "./Clients/saga";
import BlogPreviewSaga from "./BlogPreview/saga";
import NatureShowcaseSaga from "./NatureShowcase/saga";
import BlogDetailSaga from "./BlogDetail/saga";
import ProductDetailSaga from "./ProductDetail/saga";
import ProductDetailRelatedProductsSaga from "./ProductDetailRelatedProducts/saga";
import PortfolioSaga from "./Portfolio/saga";
import GallerySaga from "./Gallery/saga";
import TeamMembersSaga from "./TeamMembers/saga"; 
import OpportunitiesSaga from "./Opportunities/saga";     

import ApplyFormSaga from "./ApplyForm/saga";
import ContactPageFormSaga from "./ContactPageForm/saga";
import CommonContactEnquiryFormSaga from "./CommonContactEnquiryForm/saga";
import ProjectDetailSaga from "./ProjectDetail/saga";
import CataloguesSaga from "./Catalogue/saga";


export default function* rootSaga() {
  yield all([
    ProductsSaga(),
    FeaturedProjectsSaga(),
    TestimonialsSaga(),
    PartnersSaga(),
    BlogPreviewSaga(),
    NatureShowcaseSaga(),
    BlogDetailSaga(),
    ProductDetailSaga(),
    ProductDetailRelatedProductsSaga(),
    PortfolioSaga(),
    GallerySaga(), 
    TeamMembersSaga(),
    OpportunitiesSaga(),
    ApplyFormSaga(),
    ContactPageFormSaga(),
    CommonContactEnquiryFormSaga(), 
    ProjectDetailSaga(),
    CataloguesSaga(),
  ]);
}