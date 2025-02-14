"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditVendor() {
  const { id } = useParams();
  const router = useRouter();

  const [vendor, setVendor] = useState(null);
  const [vendorName, setVendorName] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchVendor() {
      const res = await fetch(`/api/vendors/${id}`);
      if (res.ok) {
        const data = await res.json();
        setVendor(data);
        setVendorName(data.vendorName);
        setBankAccountNo(data.bankAccountNo);
        setBankName(data.bankName);
      } else {
        console.error("Vendor not found");
      }
      setLoading(false);
    }

    fetchVendor();
  }, [id]);

  const updateVendor = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/vendors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendorName, bankAccountNo, bankName }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      console.error("Failed to update vendor");
    }
  };

  if (loading) return <p className="text-center text-white">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Vendor</h1>

      <form onSubmit={updateVendor} className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <label className="block mb-2">Vendor Name</label>
        <input
          type="text"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <label className="block mb-2">Bank Account No</label>
        <input
          type="text"
          value={bankAccountNo}
          onChange={(e) => setBankAccountNo(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <label className="block mb-2">Bank Name</label>
        <input
          type="text"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-2 rounded-lg font-semibold"
        >
          Update Vendor
        </button>
      </form>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-4 bg-gray-700 hover:bg-gray-600 transition-all text-white py-2 px-4 rounded-lg"
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}
