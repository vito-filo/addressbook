// ContactTable.tsx — Main data table displaying contacts with avatars, alternating rows,
// and row selection. Shows a loading spinner or empty state when appropriate.
import { BookUser, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";

interface ContactTableProps {
  contacts: Contact[];
  loading: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

/**
 * Renders the address book table. Clicking a row toggles selection.
 * Deselects the row if it is already selected.
 */
export function ContactTable({
  contacts,
  loading,
  selectedId,
  onSelect,
}: ContactTableProps) {
  return (
    <div className="border-y border-slate-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-white hover:bg-white">
            <TableHead className="w-12" />
            <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-500">
              First Name
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Last Name
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Phone
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="py-16 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-slate-400" />
              </TableCell>
            </TableRow>
          ) : contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-16 text-center">
                <BookUser className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                <p className="text-sm font-medium text-slate-400">
                  No contacts in your address book.
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Click &ldquo;+ New&rdquo; to add the first one.
                </p>
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact, index) => (
              <TableRow
                key={contact.id}
                onClick={() => onSelect(contact.id)}
                className={cn(
                  "cursor-pointer transition-colors",
                  index % 2 === 0 ? "bg-white" : "bg-slate-50",
                  selectedId === contact.id
                    ? "bg-indigo-50 hover:bg-indigo-50"
                    : "hover:bg-slate-100"
                )}
              >
                <TableCell className="pr-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-indigo-100 text-xs font-semibold text-indigo-700">
                      {contact.first_name[0]?.toUpperCase()}
                      {contact.last_name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-900">
                  {contact.first_name}
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-900">
                  {contact.last_name}
                </TableCell>
                <TableCell className="text-sm text-slate-500">
                  {contact.phone}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
