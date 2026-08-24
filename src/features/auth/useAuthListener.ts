import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase/app";
import { useAuthStore } from "@/store/auth";

export function useAuthListener() {
  const setUser = useAuthStore((state) => state.setUser);
  const setReady = useAuthStore((state) => state.setReady);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setReady(true);
    });

    return unsubscribe;
  }, [setUser, setReady]);
}
