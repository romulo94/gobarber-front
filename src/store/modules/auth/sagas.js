import { all, call, put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { Types, signInSuccess, signFailure } from './actions';
import api from '~/services/api';
import history from '~/services/history';

export function* singIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, '/sessions', { email, password });

    const { token, user } = response.data;

    if (!user.provider) {
      toast.error('Usuário nao é prestador');
      return;
    }

    yield put(signInSuccess(token, user));

    history.push('/dashboard');
  } catch (error) {
    toast.error('Falha na autenticação. Verifique seus dados.');
    yield put(signFailure());
  }
}

export function* singUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, '/users', {
      name,
      email,
      password,
      provider: true,
    });

    history.push('/dashboard');
  } catch (error) {
    toast.error('Falha no cadastro. Verifique seus dados.');

    yield put(signFailure());
  }
}

export default all([
  takeLatest(Types.SIGN_IN_REQUEST, singIn),
  takeLatest(Types.SIGN_UP_REQUEST, singUp),
]);
