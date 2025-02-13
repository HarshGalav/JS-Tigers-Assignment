import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({
  vendorName: { type: String, required: true },
  bankAccountNo: { type: String, required: true },
  bankName: { type: String, required: true },
  addressLine1: String,
  addressLine2: String,
  city: String,
  country: String,
  zipCode: String,
});

export default mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);
