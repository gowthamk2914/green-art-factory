import { combineReducers } from "redux";

import ProductsReducer from "./Products/reducer";

const rootReducer = combineReducers({
  Products: ProductsReducer,
});

export default rootReducer;