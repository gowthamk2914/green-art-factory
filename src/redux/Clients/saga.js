import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  GET_PARTNERS_REQUEST,
  getPartnersSuccess,
  getPartnersFailure,
} from "./actions";

function* getPartnersSaga() {
  try {
    const response = yield call(
      axios.get,
      `${API_URL}/homepage/partners`
    );

    yield put(
      getPartnersSuccess(response.data.data || [])
    );
  } catch (error) {
    yield put(
      getPartnersFailure(
        error.response?.data?.message || error.message
      )
    );
  }
}

export default function* PartnersSaga() {
  yield takeLatest(
    GET_PARTNERS_REQUEST,
    getPartnersSaga
  );
}