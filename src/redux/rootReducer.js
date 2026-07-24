import { combineReducers } from "redux";

import ProductsReducer from "./Products/reducer";
import FeaturedProjectsReducer from "./FeaturedProjects/reducer";
import TestimonialsReducer from "./Testimonials/reducer";
import PartnersReducer from "./Clients/reducer";
import BlogPreviewReducer from "./BlogPreview/reducer";
import NatureShowcaseReducer from "./NatureShowcase/reducer";

const rootReducer = combineReducers({
  Products: ProductsReducer,
  FeaturedProjects: FeaturedProjectsReducer,
  Testimonials: TestimonialsReducer,
  Clients: PartnersReducer,
  BlogPreview: BlogPreviewReducer,
  NatureShowcase: NatureShowcaseReducer,
});

export default rootReducer;