import mongoose from "mongoose";

const AmexSchema = new mongoose.Schema(
  {
    cardName: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bankbalance: {
      type: Number,
      default: 0
    }
  }
);

const Amex = mongoose.model("Amex", AmexSchema);
export default Amex;
