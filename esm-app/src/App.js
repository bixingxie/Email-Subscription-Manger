import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { HomePage } from './Components/HomePage';
import AboutPage from './Components/AboutPage';

import CssBaseline from '@material-ui/core/CssBaseline';
import "./App.css";

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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
}));

const theme = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

export default function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
        <ThemeProvider theme={theme}>
        <CssBaseline />
            <div className={classes.root}>
                    <AppBar position="static">
                        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="Home" {...a11yProps(0)} />
                        <Tab label="About" {...a11yProps(1)} />
                        <Tab label="Privacy" {...a11yProps(2)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <HomePage/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <AboutPage/>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        Privacy
                    </TabPanel>
            </div>
        </ThemeProvider>
    </React.Fragment>
  );
}

