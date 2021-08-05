import React, { useRef, useEffect, useMemo } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { readMessages } from "../../store/utils/thunkCreators";
import { useDispatch } from "react-redux";

const calclastReadMessageIndex = (messages, userId) => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].senderId === userId && messages[i].isRead) {
      return i;
    }
  }
  return null;
};

const Messages = (props) => {
  const { messages, otherUser, userId, conversationId, unReadCount } = props;
  const readObserveRef = useRef();
  const dispatch = useDispatch();

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  };

  const lastReadMessageIndex = useMemo(
    () => calclastReadMessageIndex(messages, userId, otherUser.id),
    [messages, userId]
  );

  useEffect(() => {
    //observe that user reads the messages or not using intersection observer
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      //if there is readObserveRef in users display, dispatch readMessages action
      if (entry.isIntersecting) {
        if (unReadCount !== 0) {
          dispatch(readMessages(conversationId, userId, otherUser.id));
        } else {
          observer.disconnect();
        }
      }
    }, options);

    if (readObserveRef.current) observer.observe(readObserveRef.current);
    return () => observer.disconnect();
  }, [unReadCount]);

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
      <div ref={readObserveRef}></div>
    </Box>
  );
};

export default Messages;
