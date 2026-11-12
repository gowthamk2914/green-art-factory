import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  GET_HOME_HERO_REQUEST,
  getHomeHeroSuccess,
  getHomeHeroFailure,
} from "./actions";

// GET ${API_URL}/homepage/hero
//   -> { data: [ { id, headline, subtext, cta_label, cta_url, image } ] }
function* getHomeHeroSaga() {
  try {
    const response = yield call(axios.get, `${API_URL}/homepage/hero`);
    yield put(getHomeHeroSuccess(response.data));
  } catch (error) {
    yield put(
      getHomeHeroFailure(error.response?.data?.message || error.message)
    );
  }
}

export default function* HomeHeroSaga() {
  yield takeLatest(GET_HOME_HERO_REQUEST, getHomeHeroSaga);
}