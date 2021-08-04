import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  previewTextBold: {
    fontSize: 12,
    color: "#111111",
    letterSpacing: -0.17,
    fontWeight: 900,
  },
  unReadCount: {
    fontSize: 12,
    color: "#FFFFFF",
    background: "#3A8DFF",
    borderRadius: 10,
    height: "100%",
    padding: "3px 8px ",
    margin: "auto 0",
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser, unReadCount } = conversation;
  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography
          className={
            unReadCount !== 0 ? classes.previewTextBold : classes.previewText
          }
        >
          {latestMessageText}
        </Typography>
      </Box>
      {unReadCount !== 0 && (
        <Typography className={classes.unReadCount}>{unReadCount}</Typography>
      )}
    </Box>
  );
};

export default ChatContent;
