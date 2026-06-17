// contact.ts — TypeScript interfaces for the Contact domain model.

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  age: number;
}

/** Fields required when creating or updating a contact (no id). */
export type ContactPayload = Omit<Contact, "id">;
