import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import { logout, fetchConversations } from "../store/utils/thunkCreators";
import { clearOnLogout } from "../store/index";

const styles = {
  root: {
    height: "97vh",
  },
};

const Home = ({ classes }) => {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    setIsLoggedIn(true);
  }, [user]);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [fetchConversations]);

  const handleLogout = async () => {
    const logoutComb = async () => {
      dispatch(logout());
      dispatch(clearOnLogout());
    };
    await logoutComb();
  };

  return !user.id ? (
    isLoggedIn ? (
      <Redirect to="/login" />
    ) : (
      <Redirect to="/register" />
    )
  ) : (
    <>
      {/* logout button will eventually be in a dropdown next to username */}
      <Button className={classes.logout} onClick={handleLogout}>
        Logout
      </Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer />
        <ActiveChat />
      </Grid>
    </>
  );
};

export default withStyles(styles)(Home);
