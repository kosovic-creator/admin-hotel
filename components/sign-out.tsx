"use client";

import { signOut } from "next-auth/react";

const SignOut = () => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div >
      <button type="button" className="cursor-pointer transition-colors duration-200 hover:underline" onClick={handleSignOut}>
        Odjavi se
      </button>
    </div>
  );
};

export { SignOut };
