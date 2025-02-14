"use client";
import { signOut, useSession } from "next-auth/react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

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

  if (status === "loading") return <p className="text-gray-400">Loading...</p>;
  if (!session) {
    router.push("/login");
    return <p className="text-gray-400">Redirecting...</p>;
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
      mutate();
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

  const deleteVendor = async (vendorId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this vendor?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/vendors/${vendorId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      mutate();
    } else {
      console.error("Failed to delete vendor");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold">Welcome, {session.user?.name}</h1>
      <p className="text-gray-400">Email: {session.user?.email}</p>
      <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">Logout</button>
      
      <h2 className="text-xl font-semibold mt-6">Add Vendor</h2>
      <form onSubmit={addVendor} className="bg-gray-800 p-4 rounded mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="p-2 bg-gray-700 text-white rounded" type="text" placeholder="Vendor Name" value={vendorName} onChange={(e) => setVendorName(e.target.value)} required />
          <input className="p-2 bg-gray-700 text-white rounded" type="text" placeholder="Bank Account Number" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} required />
          <input className="p-2 bg-gray-700 text-white rounded" type="text" placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
          <input className="p-2 bg-gray-700 text-white rounded" type="text" placeholder="Address Line 1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
          <input className="p-2 bg-gray-700 text-white rounded" type="text" placeholder="Address Line 2" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
          <input className="p-2 bg-gray-700 text-white rounded" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <input className="p-2 bg-gray-700 text-white rounded" type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
          <input className="p-2 bg-gray-700 text-white rounded" type="text" placeholder="Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Vendor</button>
      </form>
      
      <h2 className="text-xl font-semibold mt-6">Vendors</h2>
      <table className="w-full mt-2 border-collapse border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2 border border-gray-700">Name</th>
            <th className="p-2 border border-gray-700">Bank Account</th>
            <th className="p-2 border border-gray-700">Bank Name</th>
            <th className="p-2 border border-gray-700">City</th>
            <th className="p-2 border border-gray-700">Country</th>
            <th className="p-2 border border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((vendor: any) => (
            <tr key={vendor._id} className="bg-gray-700">
              <td className="p-2 border border-gray-600">{vendor.vendorName}</td>
              <td className="p-2 border border-gray-600">{vendor.bankAccountNo}</td>
              <td className="p-2 border border-gray-600">{vendor.bankName}</td>
              <td className="p-2 border border-gray-600">{vendor.city}</td>
              <td className="p-2 border border-gray-600">{vendor.country}</td>
              <td className="p-2 border border-gray-600 flex space-x-2">
                <Link href={`/vendors/${vendor._id}/edit`} className="text-blue-400 hover:underline">Edit</Link>
                <button onClick={() => deleteVendor(vendor._id)} className="text-red-400 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
