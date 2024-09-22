"use client";

import { useSession, signIn } from "next-auth/react";
import React from "react";

const Dashboard = () => {
  const { data: sessionData } = useSession();
  return (
    <div>
      {sessionData ? (
        <div>
          <h1>Dashboard</h1>
          <p>{JSON.stringify(sessionData)}</p>
        </div>
      ) : (
        <div>
          <h1>you are not logged in</h1>
          <button onClick={() => void signIn("gitgub")}>login</button>{" "}
        </div>
      )}
    </div>
  );
};
export default Dashboard;
