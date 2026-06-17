// App.tsx — Root component: composes ContactTable, ContactForm, ConfirmDialog,
// and the action buttons. Contains no direct business logic.
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ContactForm } from "@/components/ContactForm";
import { ContactTable } from "@/components/ContactTable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { useContacts } from "@/hooks/useContacts";
import type { Contact, ContactPayload } from "@/types/contact";

export default function App() {
  const {
    contacts,
    loading,
    selectedId,
    setSelectedId,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useContacts();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);

  const selectedContact = contacts.find((c) => c.id === selectedId) ?? null;

  function openNew() {
    setEditTarget(null);
    setFormOpen(true);
  }

  function openEdit() {
    if (!selectedContact) {
      toast.error("Please select a contact before editing.");
      return;
    }
    setEditTarget(selectedContact);
    setFormOpen(true);
  }

  function openDelete() {
    if (!selectedContact) {
      toast.error("Please select a contact before deleting.");
      return;
    }
    setDeleteTarget(selectedContact);
  }

  async function onFormSave(payload: ContactPayload) {
    setFormOpen(false);
    if (editTarget) {
      await handleUpdate(editTarget.id, payload);
    } else {
      await handleCreate(payload);
    }
  }

  async function onDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleteTarget(null);
    await handleDelete(deleteTarget.id);
  }

  function handleRowSelect(id: number) {
    setSelectedId(selectedId === id ? null : id);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-3xl mx-auto my-8 rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Card header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <h1 className="text-xl font-semibold text-slate-900">Address Book</h1>
        </div>

        {/* Table */}
        <ContactTable
          contacts={contacts}
          loading={loading}
          selectedId={selectedId}
          onSelect={handleRowSelect}
        />

        {/* Card footer — action buttons */}
        <div className="px-6 py-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
            onClick={openNew}
          >
            <Plus className="mr-2 h-4 w-4" />
            New
          </Button>

          <Button
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50 w-full sm:w-auto"
            onClick={openEdit}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button
            className="bg-rose-600 hover:bg-rose-700 text-white w-full sm:w-auto"
            onClick={openDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <ContactForm
        open={formOpen}
        contact={editTarget}
        onSave={(payload) => { void onFormSave(payload); }}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        firstName={deleteTarget?.first_name ?? ""}
        lastName={deleteTarget?.last_name ?? ""}
        onConfirm={() => { void onDeleteConfirm(); }}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}
