import { Contact } from "@/types/contact.entity";
import { User } from "@/types/user.entity";

export function getPublicProfileName(user?: User | null): string {
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ");
}

export function findContactByAddress(
  contacts: Contact[],
  address?: string | null,
): Contact | undefined {
  if (!address) return undefined;

  return contacts.find(
    (contact) => contact.address.toLowerCase() === address.toLowerCase(),
  );
}

interface ResolveDisplayNameOptions {
  address?: string | null;
  user?: User | null;
  contacts?: Contact[];
  fallback?: string;
  fixedLabel?: string;
}

export function resolveDisplayName({
  address,
  user,
  contacts = [],
  fallback = "Without Name",
  fixedLabel,
}: ResolveDisplayNameOptions): string {
  if (fixedLabel) return fixedLabel;

  const publicProfileName = getPublicProfileName(user);
  if (publicProfileName) return publicProfileName;

  const contact = findContactByAddress(contacts, address);
  if (contact?.name) return contact.name;

  return fallback;
}

export function getDisplayInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return "?";
}
