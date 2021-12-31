import dotenv from "dotenv";
import { createServer } from "http";

import { connect, ConnectOptions } from "mongoose";
import { Server } from "socket.io";

import app from "./app";
import { socketImplementations } from "./utils/socket";

dotenv.config();

try {
  connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
  } as ConnectOptions);
  console.log("DB Connected");
} catch (error) {
  console.log("DB Connection Failed");
}

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
  },
});

socketImplementations(io);

//
const port = process.env.PORT || 5000;
server.listen(port, async () => {
  console.log(`App running on port ${port}`);
});
