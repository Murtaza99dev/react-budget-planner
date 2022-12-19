import React, { createContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';


const saveToLocalStorage = (newState) => {
  localStorage.setItem("budget", newState.budget);
  localStorage.setItem("expenses", JSON.stringify(newState.expenses));
}

// 5. The reduceer - this is used to update the state, based on the action
export const AppReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_EXPENSE': {

      const newState = {
        ...state,
        expenses: [...state.expenses, action.payload],
      };

      saveToLocalStorage(newState);

      return newState;
    }

    case 'DELETE_EXPENSE': {

      const newState = {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense.id !== action.payload
        ),
      };

      saveToLocalStorage(newState);
      return newState;
    }
    case 'SET_BUDGET':

      const newState = {
        ...state,
        budget: action.payload,
      };

      saveToLocalStorage(newState)
      return newState;
    default:
      return state;
  }
};

// 1. Sets the initial state when the app loads
const initialState = {
  budget: +localStorage.getItem("budget") ?? 2000,
  expenses: JSON.parse(localStorage.getItem("expenses") ?? "[]"),
};

// 2. Creates the context this is the thing our components import and use to get the state
export const AppContext = createContext();

// 3. Provider component - wraps the components we want to give access to the state
// Accepts the children, which are the nested(wrapped) components
export const AppProvider = (props) => {
  // 4. Sets up the app state. takes a reducer, and an initial state
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // 5. Returns our context. Pass in the values we want to expose
  return (
    <AppContext.Provider
      value={{
        expenses: state.expenses,
        budget: state.budget,
        dispatch,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
