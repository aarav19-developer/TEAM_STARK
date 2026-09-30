/* =========================================================
   AppContext.jsx  – Global state via Context + useReducer
   Persisted to localStorage key "sahayak".

   NOTE (Backend migration): When you add a backend, swap the
   dispatch calls in this file with API calls. The shape of
   state and the action types can stay the same.
   ========================================================= */

import { createContext, useContext, useReducer, useEffect } from 'react';
import {
  seedItems, seedDonors, seedDonations, seedDistributions, INITIAL_UID,
} from '../data/seedData';

/* -------- initial state -------- */
const INITIAL_STATE = {
  items:         seedItems,
  donors:        seedDonors,
  donations:     seedDonations,
  distributions: seedDistributions,
  uid:           INITIAL_UID,
};

/* -------- load from localStorage -------- */
function loadState() {
  try {
    const raw = localStorage.getItem('sahayak');
    if (!raw) return INITIAL_STATE;
    return JSON.parse(raw);
  } catch {
    return INITIAL_STATE;
  }
}

/* -------- save to localStorage -------- */
function saveState(state) {
  try {
    localStorage.setItem('sahayak', JSON.stringify(state));
  } catch { /* ignore quota errors */ }
}

/* -------- reducer -------- */
function reducer(state, action) {
  switch (action.type) {

    /* --- Items --- */
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, { ...action.payload, id: state.uid + 1 }],
        uid: state.uid + 1,
      };
    case 'EDIT_ITEM':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, ...action.payload } : i
        ),
      };
    case 'DELETE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };

    /* --- Donors --- */
    case 'ADD_DONOR':
      return {
        ...state,
        donors: [...state.donors, { ...action.payload, id: state.uid + 1 }],
        uid: state.uid + 1,
      };
    case 'EDIT_DONOR':
      return {
        ...state,
        donors: state.donors.map((d) =>
          d.id === action.payload.id ? { ...d, ...action.payload } : d
        ),
      };
    case 'DELETE_DONOR':
      return { ...state, donors: state.donors.filter((d) => d.id !== action.id) };

    /* --- Donations --- */
    case 'ADD_DONATION': {
      const { id: itemId, qty } = action.payload;
      return {
        ...state,
        donations: [...state.donations, { ...action.payload, id: state.uid + 1 }],
        uid: state.uid + 1,
        // increase stock
        items: state.items.map((it) =>
          it.id === itemId ? { ...it, qty: it.qty + qty } : it
        ),
      };
    }
    case 'DELETE_DONATION': {
      const don = state.donations.find((d) => d.id === action.id);
      if (!don) return state;
      return {
        ...state,
        donations: state.donations.filter((d) => d.id !== action.id),
        // reverse stock: never go below 0
        items: state.items.map((it) =>
          it.id === don.item
            ? { ...it, qty: Math.max(0, it.qty - don.qty) }
            : it
        ),
      };
    }

    /* --- Distributions --- */
    case 'ADD_DISTRIBUTION': {
      const { item: itemId, qty } = action.payload;
      return {
        ...state,
        distributions: [...state.distributions, { ...action.payload, id: state.uid + 1 }],
        uid: state.uid + 1,
        // decrease stock
        items: state.items.map((it) =>
          it.id === itemId ? { ...it, qty: Math.max(0, it.qty - qty) } : it
        ),
      };
    }
    case 'DELETE_DISTRIBUTION': {
      const dist = state.distributions.find((d) => d.id === action.id);
      if (!dist) return state;
      return {
        ...state,
        distributions: state.distributions.filter((d) => d.id !== action.id),
        // reverse stock
        items: state.items.map((it) =>
          it.id === dist.item
            ? { ...it, qty: it.qty + dist.qty }
            : it
        ),
      };
    }

    /* --- Reset --- */
    case 'RESET':
      return INITIAL_STATE;

    default:
      return state;
  }
}

/* -------- context -------- */
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  // Persist on every state change
  useEffect(() => { saveState(state); }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

/** Convenience hook */
export function useApp() {
  return useContext(AppContext);
}
