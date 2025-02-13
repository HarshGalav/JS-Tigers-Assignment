import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Vendor from "@/models/Vendor";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const data = await req.json();
  const vendor = await Vendor.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(vendor, { status: 200 });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  await Vendor.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted" }, { status: 204 });
}
