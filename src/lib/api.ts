// API service layer for backend REST API

const API_BASE = 'http://localhost:3000/api';

// --- Session Management ---
export async function getSessions() {
  const res = await fetch(`${API_BASE}/sessions`);
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
}

export async function getSession(id: string) {
  const res = await fetch(`${API_BASE}/sessions/${id}`);
  if (!res.ok) throw new Error('Failed to fetch session');
  return res.json();
}

export async function createSession(data: { name: string; type: string }) {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create session');
  return res.json();
}

export async function updateSession(id: string, data: any) {
  const res = await fetch(`${API_BASE}/sessions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update session');
  return res.json();
}

export async function deleteSession(id: string) {
  const res = await fetch(`${API_BASE}/sessions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete session');
  return res.json();
}

// --- Event Management ---
export async function getEvents(params?: { session_id?: string; application?: string }) {
  const url = new URL(`${API_BASE}/events`, window.location.origin);
  if (params?.session_id) url.searchParams.append('session_id', params.session_id);
  if (params?.application) url.searchParams.append('application', params.application);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function getEvent(id: string) {
  const res = await fetch(`${API_BASE}/events/${id}`);
  if (!res.ok) throw new Error('Failed to fetch event');
  return res.json();
}

export async function createEvent(data: { session_id: string; type: string; content: string; level: string }) {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
}

export async function getSessionEvents(session_id: string) {
  const res = await fetch(`${API_BASE}/sessions/${session_id}/events`);
  if (!res.ok) throw new Error('Failed to fetch session events');
  return res.json();
} 