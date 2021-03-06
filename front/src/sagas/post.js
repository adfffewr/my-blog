import { all, fork, call, put, takeLatest } from 'redux-saga/effects';
import {
  POST_ADD_REQUEST,
  POST_ADD_SUCCESS,
  POST_ADD_FAILURE,
  POST_LOAD_REQUEST,
  POST_LOAD_SUCCESS,
  POST_LOAD_FAILURE,
  POST_SCROLL_REQUEST,
  POST_SCROLL_FAILURE,
  POST_DETAIL_LOAD_REQUEST,
  POST_DETAIL_LOAD_SUCCESS,
  POST_DETAIL_LOAD_FAILURE,
  POST_DELETE_REQUEST,
} from '../modules/posts';
import * as firebase from 'firebase/app';

function postaddtAPI(action) {
  // console.log(action);
  const {
    title,
    category,
    url,
    description,
    tags,
    date,
    content,
    createdAt,
    modifiedAt,
  } = action;
  const id = category + '_' + url;
  firebase
    .firestore()
    .collection('docs')
    .doc(id)
    .set({ title, description, tags, createdAt, date, category, url });
  const cid = id + '/content/last';
  firebase
    .firestore()
    .collection('docs')
    .doc(cid)
    .set({ createdAt, modifiedAt, content });
}

function* postadd(action) {
  try {
    // console.log(action);
    yield call(postaddtAPI, action.data);
    yield put({
      type: POST_ADD_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: POST_ADD_FAILURE,
      error: e,
    });
  }
}

function* watchPostAdd() {
  yield takeLatest(POST_ADD_REQUEST, postadd);
}

function postloadAPI() {
  return firebase
    .firestore()
    .collection('docs')
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get();
}

function* postload() {
  try {
    const result = yield call(postloadAPI);
    // console.log(result);
    yield put({
      type: POST_LOAD_SUCCESS,
      data: result,
    });
  } catch (e) {
    yield put({
      type: POST_LOAD_FAILURE,
      error: e,
    });
  }
}

function* watchPostLoad() {
  yield takeLatest(POST_LOAD_REQUEST, postload);
}

function postscrollAPI(action) {
  return firebase
    .firestore()
    .collection('docs')
    .orderBy('createdAt', 'desc')
    .startAfter(action.data)
    .limit(10)
    .get();
}

function* postscroll(action) {
  try {
    const result = yield call(postscrollAPI, action);
    // console.log(result);
    yield put({
      type: POST_LOAD_SUCCESS,
      data: result,
    });
  } catch (e) {
    yield put({
      type: POST_SCROLL_FAILURE,
      error: e,
    });
  }
}

function* watchPostScroll() {
  yield takeLatest(POST_SCROLL_REQUEST, postscroll);
}

function metaReadAPI(action) {
  return firebase
    .firestore()
    .collection('docs')
    .doc(action)
    .get();
}

function docReadAPI(action) {
  // console.log(action);
  return firebase
    .firestore()
    .collection('docs')
    .doc(`${action}/content/last`)
    .get();
}

function* postview(action) {
  try {
    const metaRead = yield call(metaReadAPI, action.data);
    const docRead = yield call(docReadAPI, action.data);
    yield put({
      type: POST_DETAIL_LOAD_SUCCESS,
      data: { metaRead, docRead },
    });
  } catch (e) {
    yield put({
      type: POST_DETAIL_LOAD_FAILURE,
      error: e,
    });
  }
}

function* watchPostView() {
  yield takeLatest(POST_DETAIL_LOAD_REQUEST, postview);
}

function postdeleteAPI(action) {
  return firebase
    .firestore()
    .collection('docs')
    .doc(action)
    .delete();
}

function postdeleteAPI2(action) {
  // console.log(action);
  return firebase
    .firestore()
    .collection('docs')
    .doc(`${action}/content/last`)
    .delete();
}

function* postdelete(action) {
  try {
    yield call(postdeleteAPI, action.data);
    yield call(postdeleteAPI2, action.data);
  } catch (e) {
    console.log(e);
  }
}

function* watchPostDelete() {
  yield takeLatest(POST_DELETE_REQUEST, postdelete);
}

export default function* postSaga() {
  yield all([
    fork(watchPostAdd),
    fork(watchPostLoad),
    fork(watchPostScroll),
    fork(watchPostView),
    fork(watchPostDelete),
  ]);
}
