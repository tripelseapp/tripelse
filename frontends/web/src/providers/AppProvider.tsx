"use client";
import { PoluiProvider, Toaster } from "pol-ui";
import { PropsWithChildren } from "react";

const AppProvider = (props: PropsWithChildren) => {
  return (
    <PoluiProvider>
      {props.children}
      <Toaster position="top-right" />
    </PoluiProvider>
  );
};

export default AppProvider;
