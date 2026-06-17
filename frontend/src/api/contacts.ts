// contacts.ts — HTTP client functions for the /contacts API resource.
import type { Contact, ContactPayload } from "@/types/contact";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

/** Fetch all contacts from the backend. */
export async function getContacts(): Promise<Contact[]> {
  const res = await fetch(`${API_BASE}/contacts/`);
  if (!res.ok) throw new Error(`Failed to fetch contacts: ${res.status}`);
  return res.json() as Promise<Contact[]>;
}

/** Create a new contact and return the persisted record. */
export async function createContact(payload: ContactPayload): Promise<Contact> {
  const res = await fetch(`${API_BASE}/contacts/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to create contact: ${res.status}`);
  return res.json() as Promise<Contact>;
}

/** Update an existing contact by id and return the updated record. */
export async function updateContact(
  id: number,
  payload: ContactPayload
): Promise<Contact> {
  const res = await fetch(`${API_BASE}/contacts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to update contact: ${res.status}`);
  return res.json() as Promise<Contact>;
}

/** Delete a contact by id. */
export async function deleteContact(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/contacts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete contact: ${res.status}`);
}
