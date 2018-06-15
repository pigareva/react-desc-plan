import { currentTime } from '../actions';
import store from '../store';
import { END_WORKING_DAY_TIME, START_WORKING_DAY_TIME, TIME_INTERVAL } from '../consts';

const getCurrentTime = (time) => {
  let res = time.time || START_WORKING_DAY_TIME;
  const currentTimerID = setInterval(() => {
    res = res >= END_WORKING_DAY_TIME ? END_WORKING_DAY_TIME : res + 1;
    store.dispatch(currentTime(res));
  }, TIME_INTERVAL);

  if (res === END_WORKING_DAY_TIME) {
    clearInterval(currentTimerID);
  }
};

export default getCurrentTime;
