import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  amount: Number,
  purchaser: String, //email
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Ticket", TicketSchema);