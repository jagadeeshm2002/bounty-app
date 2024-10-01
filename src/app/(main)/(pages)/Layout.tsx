import React from 'react';
import { getServerSession } from 'next-auth';
import { Redirect } from '@/components/Redirect';

interface Props {
  children: React.ReactNode;
}

export default async function MainLayout(props: Props) {
  const session = await getServerSession();
  console.log(session)

  if (!session?.user) {
    return <Redirect to={'/auth/signin'} />;
  }
  return <div className="w-full h-full">{props.children}</div>;
}