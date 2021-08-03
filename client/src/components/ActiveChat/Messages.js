import React, { useRef, useEffect } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { readMessages } from "../../store/utils/thunkCreators";
import { connect, useDispatch } from "react-redux";

const Messages = (props) => {
  const { messages, otherUser, userId, conversationId, unReadChats } = props;
  const divRef = useRef();
  const dispatch = useDispatch();

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      if (unReadChats !== 0) {
        console.log("Messages read");
        dispatch(readMessages(conversationId));
      } else {
        observer.disconnect();
      }
    }
  }, options);

  useEffect(() => {
    if (divRef.current) observer.observe(divRef.current);
    return () => observer.disconnect();
  }, [unReadChats]);

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
      <div ref={divRef}></div>
    </Box>
  );
};

export default Messages;
