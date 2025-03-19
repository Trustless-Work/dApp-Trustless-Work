import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { Contact, ContactCategory } from "@/@types/contact.entity";

interface useMyContactsProps {
  type: ContactCategory;
}

const useMyContacts = ({ type }: useMyContactsProps) => {
  const fetchAllContactsByUser = useGlobalBoundedStore(
    (state) => state.fetchAllContactsByUser,
  );
  const { address } = useGlobalAuthenticationStore();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const fetchingRef = useRef(false);
  const lastFetchKey = useRef("");
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);

  const totalPages = useMemo(
    () => Math.ceil(contacts.length / itemsPerPage),
    [contacts, itemsPerPage],
  );

  const currentData = useMemo(() => {
    return contacts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [contacts, currentPage, itemsPerPage]);

  const memoizedFetchContacts = useCallback(async () => {
    if (!address || fetchingRef.current) return;

    const fetchKey = `${address}-${type}`;
    if (fetchKey === lastFetchKey.current) return;

    try {
      fetchingRef.current = true;
      lastFetchKey.current = fetchKey;
      setIsLoading(true);

      await fetchAllContactsByUser({ address, type });

      if (loggedUser?.contacts) {
        const contactsArray = Object.values(loggedUser.contacts) as Contact[];
        setContacts(contactsArray);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("[MyContacts] Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [address, type, loggedUser]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const debouncedFetch = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        memoizedFetchContacts();
      }, 100);
    };

    debouncedFetch();

    return () => {
      clearTimeout(timeoutId);
      fetchingRef.current = false;
    };
  }, [memoizedFetchContacts]);

  const itemsPerPageOptions = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 15, label: "15" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
  ];

  return {
    currentData,
    currentPage,
    itemsPerPage,
    totalPages,
    setItemsPerPage,
    setCurrentPage,
    itemsPerPageOptions,
    isLoading,
  };
};

export default useMyContacts;
