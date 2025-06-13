//src\store\rootReducer.ts

import { combineReducers } from '@reduxjs/toolkit';
import garageReducer from './garage/reducer';
import winnersReducer from './winners/reducer';

export const rootReducer = combineReducers({
  garage: garageReducer,
  winners: winnersReducer,
});
