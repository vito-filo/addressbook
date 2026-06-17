// useContacts.ts — Custom hook managing contact state, loading, errors, and CRUD operations.
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
} from "@/api/contacts";
import type { Contact, ContactPayload } from "@/types/contact";

interface UseContactsReturn {
  contacts: Contact[];
  loading: boolean;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  handleCreate: (payload: ContactPayload) => Promise<void>;
  handleUpdate: (id: number, payload: ContactPayload) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
}

export function useContacts(): UseContactsReturn {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getContacts();
      setContacts(data);
    } catch {
      toast.error("Failed to load contacts. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const handleCreate = useCallback(
    async (payload: ContactPayload): Promise<void> => {
      setLoading(true);
      try {
        const created = await createContact(payload);
        setContacts((prev) => [...prev, created]);
        toast.success(`${created.first_name} ${created.last_name} added.`);
      } catch {
        toast.error("Failed to create contact.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleUpdate = useCallback(
    async (id: number, payload: ContactPayload): Promise<void> => {
      setLoading(true);
      try {
        const updated = await updateContact(id, payload);
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? updated : c))
        );
        toast.success(`${updated.first_name} ${updated.last_name} updated.`);
      } catch {
        toast.error("Failed to update contact.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleDelete = useCallback(async (id: number): Promise<void> => {
    const target = contacts.find((c) => c.id === id);
    setLoading(true);
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setSelectedId(null);
      if (target) {
        toast.success(`${target.first_name} ${target.last_name} deleted.`);
      }
    } catch {
      toast.error("Failed to delete contact.");
    } finally {
      setLoading(false);
    }
  }, [contacts]);

  return {
    contacts,
    loading,
    selectedId,
    setSelectedId,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
