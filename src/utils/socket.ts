let users = [];
const addUser = async (userId: number, socketId: any) => {
  const user = users.find((user: any) => user.userId === userId);

  if (user && user.socketId === socketId) {
    return users;
  } else {
    if (user && user.socketId !== socketId) {
      await removeUser(user.socketId);
    }

    const newUser = { userId, socketId };
    users.push(newUser);
    console.log(users);
    return users;
  }
  //   return (
  //     !users.some((user: any) => user.userId === userId) &&
  //     users.push(userId, socketId)
  //   );
};

const removeUser = async (socketId: any) => {
  const indexof = users
    .map((user: any) => {
      user.socketId;
    })
    .indexOf(socketId);

  await users.splice(indexof, 1);

  return;
};

const getUser = async (userId: any) => {
  return users.find((user: any) => user.userId.userId === userId);
};
//
export const socketImplementations = (io: any) => {
  io.on("connection", (socket: any) => {
    socket.on("addUser", async (userId: any) => {
      await addUser(userId, socket.id);

      setInterval(() => {
        io.emit("getUsers", users);
      }, 10000);
    });

    //send message
    socket.on("sendMessage", async ({ senderId, recieverId, text }) => {
      const user: any = await getUser(recieverId);
      // console.log({ senderId, recieverId, text, user });

      io.to(user?.socketId).emit("getMessage", { senderId, text });
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
};
