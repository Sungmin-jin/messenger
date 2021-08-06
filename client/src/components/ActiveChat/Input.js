import React, { Component, useState } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage } from "../../store/utils/thunkCreators";

const styles = {
  root: {
    justifySelf: "flex-end",
    marginTop: 15,
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20,
  },
};

// class Input extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       text: "",
//     };
//   }

//   handleChange = (event) => {
//     this.setState({
//       text: event.target.value,
//     });
//   };

//   handleSubmit = async (event) => {
//     event.preventDefault();
//     // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
//     const reqBody = {
//       text: event.target.text.value,
//       recipientId: this.props.otherUser.id,
//       conversationId: this.props.conversationId,
//       sender: this.props.conversationId ? null : this.props.user,
//     };
//     await this.props.postMessage(reqBody);
//     this.setState({
//       text: "",
//     });
//   };

//   render() {
//     const { classes } = this.props;
//     return (
//       <form className={classes.root} onSubmit={this.handleSubmit}>
//         <FormControl fullWidth hiddenLabel>
//           <FilledInput
//             classes={{ root: classes.input }}
//             disableUnderline
//             placeholder="Type something..."
//             value={this.state.text}
//             name="text"
//             onChange={this.handleChange}
//           />
//         </FormControl>
//       </form>
//     );
//   }
// }

const Input = ({ classes, otherUser, conversationId, user, postMessage }) => {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reqBody = {
      text: e.target.text.value,
      recipientId: otherUser.id,
      conversationId: conversationId,
      sender: conversationId ? null : user,
    };
    await postMessage(reqBody);
    setText("");
  };
  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          onChange={handleChange}
        />
      </FormControl>
    </form>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessage: (message) => {
      dispatch(postMessage(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Input));
