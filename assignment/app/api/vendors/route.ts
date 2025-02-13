import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Vendor from "@/models/Vendor";

export async function GET(req: NextRequest) {
  await connectDB();
  const vendors = await Vendor.find(); // Fetch all vendors
  return NextResponse.json(vendors, { status: 200 });
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { vendorName, bankAccountNo, bankName, addressLine1, addressLine2, city, country, zipCode } = await req.json();

    if (!vendorName || !bankAccountNo || !bankName) {
      return NextResponse.json({ error: "vendorName, bankAccountNo, and bankName are required" }, { status: 400 });
    }

    const vendor = new Vendor({
      vendorName,
      bankAccountNo,
      bankName,
      addressLine1,
      addressLine2,
      city,
      country,
      zipCode,
    });

    await vendor.save();
    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 });
  }
}
