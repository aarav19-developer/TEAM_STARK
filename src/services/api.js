/* =========================================================
   services/api.js
   All fetch() calls to the Sahayak backend.
   BASE_URL reads from Vite env or falls back to localhost.
   ========================================================= */

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(method, path, body) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();

  if (!res.ok) {
    // Throw the server-supplied message so the UI can show it in a toast
    throw new Error(data.message || "Request failed");
  }
  return data;
}

// ── Items ──────────────────────────────────────────────────
export const api = {
  // Items
  getItems:       ()       => request("GET",    "/items"),
  createItem:     (body)   => request("POST",   "/items", body),
  updateItem:     (id, body) => request("PUT",  `/items/${id}`, body),
  deleteItem:     (id)     => request("DELETE", `/items/${id}`),

  // Donors
  getDonors:      ()       => request("GET",    "/donors"),
  createDonor:    (body)   => request("POST",   "/donors", body),
  updateDonor:    (id, body) => request("PUT",  `/donors/${id}`, body),
  deleteDonor:    (id)     => request("DELETE", `/donors/${id}`),

  // Donations
  getDonations:   ()       => request("GET",    "/donations"),
  createDonation: (body)   => request("POST",   "/donations", body),
  deleteDonation: (id)     => request("DELETE", `/donations/${id}`),

  // Distributions
  getDistributions:   ()       => request("GET",    "/distributions"),
  createDistribution: (body)   => request("POST",   "/distributions", body),
  deleteDistribution: (id)     => request("DELETE", `/distributions/${id}`),

  // Dashboard
  getDashboard: () => request("GET", "/dashboard"),

  // Reset to demo data
  resetData: () => request("POST", "/seed/reset"),
};
