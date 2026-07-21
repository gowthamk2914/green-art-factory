import { all } from "redux-saga/effects";

import ProductsSaga from "./Products/saga";
import FeaturedProjectsSaga from "./FeaturedProjects/saga";
import TestimonialsSaga from "./Testimonials/saga";
import PartnersSaga from "./Clients/saga";

export default function* rootSaga() {
  yield all([
    ProductsSaga(),
    FeaturedProjectsSaga(),
    TestimonialsSaga(),
    PartnersSaga(),
  ]);
}