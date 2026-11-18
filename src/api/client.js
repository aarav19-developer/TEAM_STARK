/* =========================================================
   src/api/client.js  – Central API client
   ========================================================= */
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

export const api = {
  health:            () => request("GET",  "/health"),
  dashboard:         () => request("GET",  "/dashboard"),

  getItems:          () => request("GET",  "/items"),
  getItem:         (id) => request("GET",  `/items/${id}`),
  createItem:    (body) => request("POST", "/items", body),
  updateItem: (id,body) => request("PUT",  `/items/${id}`, body),
  deleteItem:      (id) => request("DELETE",`/items/${id}`),

  getDonors:         () => request("GET",  "/donors"),
  getDonor:        (id) => request("GET",  `/donors/${id}`),
  createDonor:   (body) => request("POST", "/donors", body),
  updateDonor: (id,body) => request("PUT",  `/donors/${id}`, body),
  deleteDonor:     (id) => request("DELETE",`/donors/${id}`),

  getDonations:      () => request("GET",  "/donations"),
  createDonation:(body) => request("POST", "/donations", body),
  deleteDonation:  (id) => request("DELETE",`/donations/${id}`),

  getDistributions:  () => request("GET",  "/distributions"),
  createDistribution:(body) => request("POST", "/distributions", body),
  deleteDistribution:(id) => request("DELETE",`/distributions/${id}`),

  resetData:         () => request("POST", "/seed/reset"),
};
