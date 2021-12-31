import mongoose, { Schema } from "mongoose";
import { Messages } from "../interface/Post";

const MessageSchema = new Schema<Messages>(
  {
    conversationId: {
      // type: Schema.Types.ObjectId,
      // ref: "User",
      type: String,
    },
    text: {
      // type: Schema.Types.ObjectId,
      // ref: "User",
      type: String,
    },
    sender: {
      // type: Schema.Types.ObjectId,
      // ref: "User",
      type: String,
    },
  },
  { timestamps: true }
);

let Messages = mongoose.model<Messages>("Messages", MessageSchema);

export { Messages };
