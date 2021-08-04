import React, { useRef, useEffect, useMemo } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { readMessages } from "../../store/utils/thunkCreators";
import { useDispatch } from "react-redux";

const CalclastReadMessageIndex = (messages, userId) => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].senderId === userId && messages[i].isRead) {
      return i;
    }
  }
  return null;
};

const Messages = (props) => {
  const { messages, otherUser, userId, conversationId, unReadChats } = props;
  const divRef = useRef();
  const dispatch = useDispatch();

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  };

  const lastReadMessageIndex = useMemo(
    () => CalclastReadMessageIndex(messages, userId),
    [messages, userId]
  );

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        if (unReadChats !== 0) {
          dispatch(readMessages(conversationId, userId));
        } else {
          observer.disconnect();
        }
      }
    }, options);

    if (divRef.current) observer.observe(divRef.current);
    return () => observer.disconnect();
  }, [unReadChats]);

  return (
    <Box>
      {messages.map((message, index) => {
        const time = moment(message.createdAt).format("h:mm");
        if (index === lastReadMessageIndex) {
          return (
            <SenderBubble
              key={message.id}
              text={message.text}
              time={time}
              otherUserPhotoUrl={otherUser.photoUrl}
            />
          );
        }

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
