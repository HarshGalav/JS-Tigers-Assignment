"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      const sessionExpiry = session.expires ? new Date(session.expires).getTime() : null;

      if (sessionExpiry && Date.now() > sessionExpiry) {
        signOut(); // Logout if session is expired
      } else {
        router.push("/dashboard");
      }
    }
  }, [session, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center w-full max-w-sm">
        {session ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Welcome, {session.user?.name} 👋</h1>
            <img
              src={session.user?.image ?? "/default-avatar.png"}
              alt="User Avatar"
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-400 mb-4">Redirecting to dashboard...</p>
            <button
              onClick={() => signOut()}
              className="w-full bg-red-600 hover:bg-red-700 transition-all text-white py-2 rounded-lg font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <p className="mb-4 text-gray-300">Sign in to continue</p>
            <button
              onClick={() => signIn("google")}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google" className="w-5 h-5" />
              Login with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}
