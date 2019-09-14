import produce from 'immer';

import { Types } from './actions';

const INITIAL_STATE = {
  token: null,
  signed: false,
  loading: false,
};

export default function auth(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case Types.SIGN_IN_REQUEST: {
        draft.loading = true;
        break;
      }

      case Types.SIGN_IN_SUCCESS: {
        draft.token = action.payload.token;
        draft.signed = true;
        draft.loading = false;
        break;
      }

      case Types.SIGN_UP_REQUEST: {
        draft.loading = true;
        break;
      }

      case Types.SIGN_FAILURE: {
        draft.loading = false;
        break;
      }

      default:
    }
  });
}
