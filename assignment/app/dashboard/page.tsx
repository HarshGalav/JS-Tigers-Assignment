"use client";
import { signOut, useSession } from "next-auth/react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const shouldFetch = status === "authenticated";
  const { data, mutate } = useSWR(shouldFetch ? "/api/vendors" : null, fetcher);

  const [vendorName, setVendorName] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return <p>Redirecting...</p>;
  }

  const addVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendorName,
        bankAccountNo,
        bankName,
        addressLine1,
        addressLine2,
        city,
        country,
        zipCode,
      }),
    });

    if (res.ok) {
      mutate(); // Refresh vendor list
      setVendorName("");
      setBankAccountNo("");
      setBankName("");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setCountry("");
      setZipCode("");
    } else {
      console.error("Failed to add vendor");
    }
  };

  // ✅ Add deleteVendor function
  const deleteVendor = async (vendorId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this vendor?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/vendors/${vendorId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      mutate(); // Refresh vendor list after deletion
    } else {
      console.error("Failed to delete vendor");
    }
  };

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
      <button onClick={() => signOut()}>Logout</button>

      {/* Add Vendor Form */}
      <h2>Add Vendor</h2>
      <form onSubmit={addVendor}>
        <input type="text" placeholder="Vendor Name" value={vendorName} onChange={(e) => setVendorName(e.target.value)} required />
        <input type="text" placeholder="Bank Account Number" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} required />
        <input type="text" placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
        <input type="text" placeholder="Address Line 1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
        <input type="text" placeholder="Address Line 2" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
        <input type="text" placeholder="Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
        <button type="submit">Add Vendor</button>
      </form>

      {/* Vendor List */}
      <h2>Vendors</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Bank Account</th>
            <th>Bank Name</th>
            <th>City</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((vendor: any) => (
            <tr key={vendor._id}>
              <td>{vendor.vendorName}</td>
              <td>{vendor.bankAccountNo}</td>
              <td>{vendor.bankName}</td>
              <td>{vendor.city}</td>
              <td>{vendor.country}</td>
              <td>
              <Link href={`/vendors/${vendor._id}/edit`}>
  Edit
</Link>
                <button onClick={() => deleteVendor(vendor._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
