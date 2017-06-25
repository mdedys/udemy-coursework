import { combineReducers } from 'redux';

import auth from './auth';
import jobs from './jobs';
import likedJobs from './likes_reducer';

export default combineReducers({
  auth,
  jobs,
  likedJobs
});
