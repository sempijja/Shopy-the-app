import React, { createContext, useContext, useState } from "react";

type StoreContextType = {
  hasStore: boolean;
  setHasStore: (value: boolean) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasStore, setHasStore] = useState(false);

  return (
    <StoreContext.Provider value={{ hasStore, setHasStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStoreContext must be used within a StoreProvider");
  return context;
};