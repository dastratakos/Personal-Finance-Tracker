import { useState, useEffect } from "react";
import { Account } from "@prisma/client";

interface UseAccountsReturn {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAccounts(): UseAccountsReturn {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/accounts");

      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const data = await response.json();
      setAccounts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    error,
    refetch: fetchAccounts,
  };
}
