import { combineReducers } from "redux";

import ProductsReducer from "./Products/reducer";
import FeaturedProjectsReducer from "./FeaturedProjects/reducer";
import TestimonialsReducer from "./Testimonials/reducer";
import PartnersReducer from "./Clients/reducer";
import BlogPreviewReducer from "./BlogPreview/reducer";
import NatureShowcaseReducer from "./NatureShowcase/reducer";
import BlogDetailReducer from "./BlogDetail/reducer";
import ProductDetailReducer from "./ProductDetail/reducer"; 
import PortfolioReducer from "./Portfolio/reducer";
import GalleryReducer from "./Gallery/reducer";
import TeamMembersReducer from "./TeamMembers/reducer";
import OpportunitiesReducer from "./Opportunities/reducer";
import ApplyFormReducer from "./ApplyForm/reducer";
import ContactPageFormReducer from "./ContactPageForm/reducer";
import CommonContactEnquiryFormReducer from "./CommonContactEnquiryForm/reducer";
import ProjectDetailReducer from "./ProjectDetail/reducer";



const rootReducer = combineReducers({
  Products: ProductsReducer,
  FeaturedProjects: FeaturedProjectsReducer,
  Testimonials: TestimonialsReducer,
  Clients: PartnersReducer,
  BlogPreview: BlogPreviewReducer,
  NatureShowcase: NatureShowcaseReducer,
  BlogDetail: BlogDetailReducer,
  ProductDetail: ProductDetailReducer, 
  Portfolio: PortfolioReducer, 
  Gallery: GalleryReducer,
  TeamMembers: TeamMembersReducer,
  Opportunities: OpportunitiesReducer,
  ApplyForm: ApplyFormReducer,
  ContactPageForm: ContactPageFormReducer,
  CommonContactEnquiryForm: CommonContactEnquiryFormReducer,
  ProjectDetail: ProjectDetailReducer,
});

export default rootReducer;