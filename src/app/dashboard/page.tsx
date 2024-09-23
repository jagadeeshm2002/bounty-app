"use client";
import { useSession } from 'next-auth/react';
import React from 'react'

type Props = {}

const page = (props: Props) => {
    const { data: sessionData } = useSession();
  return (
    <div>page {JSON.stringify(sessionData)}</div>
  )
}
export default page