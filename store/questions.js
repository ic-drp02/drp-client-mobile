import api from "../util/api";

const initialState = {
  sites: [],
  subjects: [],
};

function fetchSitesBegin() {
  return { type: "FETCH_SITES_BEGIN" };
}

function fetchSitesSuccess(sites) {
  return { type: "FETCH_SITES_SUCCESS", sites };
}

export function fetchSites() {
  return async function (dispatch) {
    dispatch(fetchSitesBegin());

    const res = await api.getSites();
    if (!res.success) {
      console.warn("failed to get sites with status " + res.status);
    }

    dispatch(fetchSitesSuccess(res.data));
  };
}

function fetchSubjectsBegin() {
  return { type: "FETCH_SUBJECTS_BEGIN" };
}

function fetchSubjectsSuccess(subjects) {
  return { type: "FETCH_SUBJECTS_SUCCESS", subjects };
}

export function fetchSubjects() {
  return async function (dispatch) {
    dispatch(fetchSubjectsBegin());

    const res = await api.getQuestionSubjects();
    if (!res.success) {
      console.warn("failed to get question subjects with status " + res.status);
    }

    dispatch(fetchSubjectsSuccess(res.data));
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_SITES_SUCCESS":
      return { ...state, sites: action.sites };

    case "FETCH_SUBJECTS_SUCCESS":
      return { ...state, subjects: action.subjects };

    default:
      return state;
  }
}
