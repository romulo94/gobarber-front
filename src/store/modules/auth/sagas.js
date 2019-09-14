import { all, call, put, takeLatest } from 'redux-saga/effects';
import { Types, signInSuccess, signFailure } from './actions';
import api from '~/services/api';
import history from '~/services/history';

export function* singIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, '/sessions', { email, password });

    const { token, user } = response.data;

    if (!user.provider) {
      console.tron.error('Usuário nao é prestador');
      return;
    }

    yield put(signInSuccess(token, user));

    history.push('/dashboard');
  } catch (error) {
    yield put(signFailure());
  }
}

export default all([takeLatest(Types.SIGN_IN_REQUEST, singIn)]);
