"use client";  // ✅ Required for using useState & useEffect

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";  // ✅ Correct imports

export default function EditVendor() {
  const { id } = useParams();  // ✅ Get the vendor ID
  const router = useRouter();  // ✅ Corrected useRouter usage

  const [vendor, setVendor] = useState(null);
  const [vendorName, setVendorName] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [bankName, setBankName] = useState("");

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
      router.push("/vendors");  // ✅ Redirect after update
    } else {
      console.error("Failed to update vendor");
    }
  };

  if (!vendor) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Vendor</h1>
      <form onSubmit={updateVendor}>
        <input type="text" value={vendorName} onChange={(e) => setVendorName(e.target.value)} />
        <input type="text" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} />
        <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
