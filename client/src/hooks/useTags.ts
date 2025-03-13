import { useEffect, useState } from "react";
import { Tag } from "../types";
import { api } from "../utils/axios";

export const useTags = () => {
  const [data, setData] = useState<Tag[]>([]);
  const [errors, setErrors] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await api.get("/auth/tags");
        setData(res.data.tags);
      } catch (error) {
        setErrors(error as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchTags();
  }, []);

  return {
    data,
    errors,
    loading,
  };
};
