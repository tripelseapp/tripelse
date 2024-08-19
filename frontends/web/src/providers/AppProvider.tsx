"use client";
import { PoluiProvider, Toaster } from "pol-ui";
import { PropsWithChildren } from "react";

const AppProvider = (props: PropsWithChildren) => {
  return (
    <PoluiProvider>
      {props.children}
      <Toaster />
    </PoluiProvider>
  );
};

export default AppProvider;
