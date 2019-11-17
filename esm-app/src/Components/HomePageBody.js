import React from "react";
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import EmailIcon from "@material-ui/icons/Email";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {SubscriptionTable} from "./SubscriptionTable";
import {UnsubbedTable} from "./UnsubbedTable";

function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            <Box p={3}>{children}</Box>
          </Typography>
        );
}

TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
      };

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  }
});

export function HomePageBody() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper square className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        aria-label="icon label tabs"
      >
        <Tab icon={<EmailIcon />} label="Keep" {...a11yProps(0)} />
        <Tab icon={<DeleteForeverIcon />} label="Unsubscribed" />
        </Tabs>

        <TabPanel value={value} index={0}>
                <SubscriptionTable/>
        </TabPanel>
        <TabPanel value={value} index={1}>
                <UnsubbedTable/>
        </TabPanel>
    </Paper>
  );
}
