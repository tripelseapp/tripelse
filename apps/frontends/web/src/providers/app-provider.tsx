"use client";
import { PoluiProvider, Toaster } from "pol-ui";
import { type PropsWithChildren } from "react";

function AppProvider(props: PropsWithChildren): React.JSX.Element {
  return (
    <PoluiProvider>
      {props.children}
      <Toaster position="top-right" />
    </PoluiProvider>
  );
}

export default AppProvider;
