import Header from "@/components/Header";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default (props: Props) => {
  return (
    <div className="flex flex-col w-full">
      <Header />
      <div className="wrapper w-full px-16 py-5">{props.children}</div>
    </div>
  );
};
