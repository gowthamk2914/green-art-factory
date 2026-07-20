import { combineReducers } from "redux";

import ProductsReducer from "./Products/reducer";
import FeaturedProjectsReducer from "./FeaturedProjects/reducer";

const rootReducer = combineReducers({
  Products: ProductsReducer,
  FeaturedProjects: FeaturedProjectsReducer,
});

export default rootReducer;