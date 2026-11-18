/* =========================================================
   AppContext.jsx  – Global state backed by the REST API.
   ========================================================= */
import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { api } from "../services/api";

const INITIAL_STATE = {
  items:         [],
  donors:        [],
  donations:     [],
  distributions: [],
  loading: true,
  error:   null,
};

function reducer(state, action) {
  switch (action.type) {

    case "LOAD_ALL":
      return { ...state, items: action.items, donors: action.donors, donations: action.donations, distributions: action.distributions, loading: false, error: null };
    case "LOAD_ERROR":
      return { ...state, loading: false, error: action.error };

    /* Items */
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.item] };
    case "EDIT_ITEM":
      return { ...state, items: state.items.map((i) => i._id === action.item._id ? action.item : i) };
    case "DELETE_ITEM":
      return { ...state, items: state.items.filter((i) => i._id !== action.id) };

    /* Donors */
    case "ADD_DONOR":
      return { ...state, donors: [...state.donors, action.donor] };
    case "EDIT_DONOR":
      return { ...state, donors: state.donors.map((d) => d._id === action.donor._id ? action.donor : d) };
    case "DELETE_DONOR":
      return { ...state, donors: state.donors.filter((d) => d._id !== action.id) };

    /* Donations – backend returns populated record + updated item qty */
    case "ADD_DONATION":
      return {
        ...state,
        donations: [...state.donations, action.donation],
        items: state.items.map((i) =>
          i._id === action.updatedItem._id ? { ...i, qty: action.updatedItem.qty } : i
        ),
      };
    case "DELETE_DONATION":
      return {
        ...state,
        donations: state.donations.filter((d) => d._id !== action.id),
        // Replace the affected item with the freshly-fetched version
        items: state.items.map((i) => i._id === action.updatedItem._id ? action.updatedItem : i),
      };

    /* Distributions */
    case "ADD_DISTRIBUTION":
      return {
        ...state,
        distributions: [...state.distributions, action.distribution],
        items: state.items.map((i) =>
          i._id === action.updatedItem._id ? { ...i, qty: action.updatedItem.qty } : i
        ),
      };
    case "DELETE_DISTRIBUTION":
      return {
        ...state,
        distributions: state.distributions.filter((d) => d._id !== action.id),
        items: state.items.map((i) => i._id === action.updatedItem._id ? action.updatedItem : i),
      };

    /* Reset */
    case "RESET_LOADING":
      return { ...state, loading: true, error: null };
    case "RESET_DONE":
      return { ...state, items: action.items, donors: action.donors, donations: action.donations, distributions: action.distributions, loading: false };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Load everything on mount
  useEffect(() => {
    (async () => {
      try {
        const [items, donors, donations, distributions] = await Promise.all([
          api.getItems(), api.getDonors(), api.getDonations(), api.getDistributions(),
        ]);
        dispatch({ type: "LOAD_ALL", items, donors, donations, distributions });
      } catch (err) {
        dispatch({ type: "LOAD_ERROR", error: err.message });
      }
    })();
  }, []);

  // Helper: fetch one item by _id
  const fetchItem = useCallback(async (id) => {
    const all = await api.getItems();
    return all.find((i) => i._id === id) ?? null;
  }, []);

  /* ── Items ── */
  const addItem = useCallback(async (body) => {
    const item = await api.createItem(body);
    dispatch({ type: "ADD_ITEM", item });
    return item;
  }, []);

  const editItem = useCallback(async (id, body) => {
    const item = await api.updateItem(id, body);
    dispatch({ type: "EDIT_ITEM", item });
    return item;
  }, []);

  const deleteItem = useCallback(async (id) => {
    await api.deleteItem(id);
    dispatch({ type: "DELETE_ITEM", id });
  }, []);

  /* ── Donors ── */
  const addDonor = useCallback(async (body) => {
    const donor = await api.createDonor(body);
    dispatch({ type: "ADD_DONOR", donor });
    return donor;
  }, []);

  const editDonor = useCallback(async (id, body) => {
    const donor = await api.updateDonor(id, body);
    dispatch({ type: "EDIT_DONOR", donor });
    return donor;
  }, []);

  const deleteDonor = useCallback(async (id) => {
    await api.deleteDonor(id);
    dispatch({ type: "DELETE_DONOR", id });
  }, []);

  /* ── Donations ── */
  const addDonation = useCallback(async (body) => {
    const donation = await api.createDonation(body);
    // Backend updated stock atomically – fetch the fresh item qty
    const itemId = donation.item?._id ?? donation.item;
    const updatedItem = (await api.getItems()).find((i) => i._id === itemId) ?? {};
    dispatch({ type: "ADD_DONATION", donation, updatedItem });
    return donation;
  }, []);

  const deleteDonation = useCallback(async (id, itemId) => {
    // Backend reverses stock atomically before responding
    await api.deleteDonation(id);
    // Fetch the now-corrected qty from the server (source of truth)
    const updatedItem = await fetchItem(itemId) ?? { _id: itemId };
    dispatch({ type: "DELETE_DONATION", id, updatedItem });
  }, [fetchItem]);

  /* ── Distributions ── */
  const addDistribution = useCallback(async (body) => {
    const distribution = await api.createDistribution(body);
    const itemId = distribution.item?._id ?? distribution.item;
    const updatedItem = (await api.getItems()).find((i) => i._id === itemId) ?? {};
    dispatch({ type: "ADD_DISTRIBUTION", distribution, updatedItem });
    return distribution;
  }, []);

  const deleteDistribution = useCallback(async (id, itemId) => {
    await api.deleteDistribution(id);
    const updatedItem = await fetchItem(itemId) ?? { _id: itemId };
    dispatch({ type: "DELETE_DISTRIBUTION", id, updatedItem });
  }, [fetchItem]);

  /* ── Reset ── */
  const resetData = useCallback(async () => {
    dispatch({ type: "RESET_LOADING" });
    await api.resetData();
    const [items, donors, donations, distributions] = await Promise.all([
      api.getItems(), api.getDonors(), api.getDonations(), api.getDistributions(),
    ]);
    dispatch({ type: "RESET_DONE", items, donors, donations, distributions });
  }, []);

  const value = {
    state,
    addItem, editItem, deleteItem,
    addDonor, editDonor, deleteDonor,
    addDonation, deleteDonation,
    addDistribution, deleteDistribution,
    resetData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
