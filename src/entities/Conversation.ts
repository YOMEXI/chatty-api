import mongoose, { Schema } from "mongoose";
import { Messages } from "../interface/Post";

const ConversationSchema = new Schema(
  {
    members: {
      //   type: Schema.Types.ObjectId,
      //   ref: "User",
      type: Array,
    },
  },
  { timestamps: true }
);

let Conversation = mongoose.model("Conversation", ConversationSchema);

export { Conversation };
