import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  readMyChats,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    console.log("data from socket", data);
    store.dispatch(setNewMessage(data.message, data.sender, true));
  });
  //data contains conversationId, readerId
  socket.on("read-chats", (data) => {
    console.log("read chats from socket");
    store.dispatch(readMyChats(data));
  });
});

export default socket;
