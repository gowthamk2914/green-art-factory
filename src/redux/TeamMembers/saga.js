import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { API_URL } from "../../utils/constants";

import {
  GET_TEAM_MEMBERS_REQUEST,
  getTeamMembersSuccess,
  getTeamMembersFailure,
} from "./actions";

function* getTeamMembersSaga() {
  try {
    const response = yield call(
      axios.get,
      `${API_URL}/homepage/team-members`
    );

    yield put(
      getTeamMembersSuccess(response.data.data || [])
    );
  } catch (error) {
    yield put(
      getTeamMembersFailure(
        error.response?.data?.message || error.message
      )
    );
  }
}

export default function* TeamMembersSaga() {
  yield takeLatest(
    GET_TEAM_MEMBERS_REQUEST,
    getTeamMembersSaga
  );
}