import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  readMyChats,
} from "./store/conversations";

//make a socket as an object so we can redeclare when user log in
const socketObj = {
  socket: io(window.location.origin, {
    auth: { token: localStorage.getItem("messenger-token") },
  }),
};

connectSocket(socketObj.socket);

//redeclare socket with new token
export const reInitializeSocket = async () => {
  socketObj.socket.disconnect();
  const token = await localStorage.getItem("messenger-token");
  const newSocket = io(window.location.origin, {
    auth: { token },
  });
  socketObj.socket = newSocket;
  connectSocket(socketObj.socket);
  return;
};

//socket logics when socket is connected
function connectSocket(socket) {
  socket.on("connect", () => {
    socket.on("add-online-user", (id) => {
      store.dispatch(addOnlineUser(id));
    });

    socket.on("remove-offline-user", (id) => {
      store.dispatch(removeOfflineUser(id));
    });
    socket.on("new-message", (data) => {
      store.dispatch(
        setNewMessage(data.message, data.sender, data.fromOtherUser)
      );
    });

    //data contains conversationId, readerId
    //when other user read my chats
    socket.on("read-chats", (data) => {
      store.dispatch(readMyChats(data));
    });

    //when send socket emit with no token
    socket.on("connect_error", (err) => {
      console.error(err);
    });
  });
}

export default socketObj;
