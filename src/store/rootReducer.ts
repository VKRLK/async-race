//src\store\rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import garageReducer from './garage/reducer';
import winnersReducer from './winners/reducer'; // ✅ This is your `winnersSlice.reducer` from the file you showed

export const rootReducer = combineReducers({
  garage: garageReducer,
  winners: winnersReducer,
});
