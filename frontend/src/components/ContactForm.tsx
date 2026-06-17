// ContactForm.tsx — Modal dialog for creating and editing a contact.
// Opens in "New" mode with empty fields or "Edit" mode with pre-filled data.
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Contact, ContactPayload } from "@/types/contact";

interface ContactFormProps {
  open: boolean;
  contact: Contact | null;
  onSave: (payload: ContactPayload) => void;
  onClose: () => void;
}

const emptyForm: ContactPayload = {
  first_name: "",
  last_name: "",
  address: "",
  phone: "",
  age: 0,
};

/** Returns an empty payload for "New" mode or maps Contact fields for "Edit" mode. */
function toFormState(contact: Contact | null): ContactPayload {
  if (!contact) return { ...emptyForm };
  const { id: _id, ...rest } = contact;
  return rest;
}

export function ContactForm({ open, contact, onSave, onClose }: ContactFormProps) {
  const [form, setForm] = useState<ContactPayload>(toFormState(contact));

  useEffect(() => {
    setForm(toFormState(contact));
  }, [contact, open]);

  function handleChange(field: keyof ContactPayload, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: field === "age" ? (value === "" ? 0 : parseInt(value, 10)) : value,
    }));
  }

  function handleSave() {
    onSave(form);
  }

  const isEditing = contact !== null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit contact" : "New contact"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-1.5">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              placeholder="e.g. John"
              value={form.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              placeholder="e.g. Doe"
              value={form.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="e.g. 1 Infinite Loop"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="e.g. 06 12 34 56 78"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min={0}
              placeholder="e.g. 30"
              value={form.age === 0 ? "" : form.age}
              onChange={(e) => handleChange("age", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
