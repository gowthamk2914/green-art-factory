import { all } from "redux-saga/effects";

import ProductsSaga from "./Products/saga";

export default function* rootSaga() {
  yield all([
    ProductsSaga(),
  ]);
}