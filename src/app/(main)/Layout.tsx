import Header from '@/components/Header';
import React from 'react';

interface Props {
  children: React.ReactNode;
  Header: React.ReactNode
}

export default (props: Props) => {
  return (
    <div className="flex min-h-screen w-full">
      <Header/>
      <div className="wrapper w-full">{props.children}</div>
    </div>
  );
};