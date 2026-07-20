import { all } from "redux-saga/effects";

import ProductsSaga from "./Products/saga";
import FeaturedProjectsSaga from "./FeaturedProjects/saga";

export default function* rootSaga() {
  yield all([
    ProductsSaga(),
    FeaturedProjectsSaga(),
  ]);
}