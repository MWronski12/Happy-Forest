import useWebSocket from 'react-use-websocket'

// Styles
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

// React
import { useEffect, useState } from "react";

// Components
import DrawerMenu from "./components/DrawerMenu";
import NavBar from "./components/NavBar";
import Chart from "./components/Chart";
import DataTable from "./components/DataTable";

// Dummy data representing every device and every measurement
export const devices = [
  {
    id: 1,
    name: "texas1",
  },
  {
    id: 2,
    name: "texas2",
  },
  {
    id: 3,
    name: "texas3",
  },
];

// CSS
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100],
  },
  gridContainer: {
    width: "100%",
    margin: "auto",
    padding: theme.spacing(10)
  },
}));

const App = () => {
  const classes = useStyles();

  const [measurements, setMeasurements] = useState([]);
  const { lastJsonMessage } = useWebSocket('ws://localhost:8080', {});
  useEffect(() => {
    if (lastJsonMessage === null) return;
    const { id, pres, temp, humi, rain } = lastJsonMessage;
    setMeasurements(m => [...m, {
      id: m.length + 1,
      deviceId: 1,
      deviceName: "texas1",
      timestamp: new Date().toLocaleString(),
      battery: 50,
      UV: 320,
      illumination: 1250,
      airTemp: temp,
      airHum: humi,
      rain: rain,
    }]);
  }, [lastJsonMessage]);

  const [state, setState] = useState({
    device: devices[0],
    activeTab: "charts",
    drawerIsOpen: false,
  });

  const handleDrawer = (bool) => setState({ ...state, drawerIsOpen: bool });
  const handleTabChange = (tabName) =>
    setState({ ...state, activeTab: tabName });
  const handleDeviceChange = (deviceId) =>
    setState({ ...state, device: deviceId });

  return (
    <Paper elevation={0} className={classes.root}>
      <NavBar
        measurements={measurements}
        state={state}
        handleDeviceChange={handleDeviceChange}
        handleDrawer={handleDrawer}
      />
      <DrawerMenu
        state={state}
        handleDrawer={handleDrawer}
        handleTabChange={handleTabChange}
      />

      {state.activeTab === "charts" ? (
        <Grid
          container
          spacing={6}
          className={classes.gridContainer}
          justify="center"
        >
          <Grid item xs={12} md={6} xl={4}>
            <Chart state={state} sensor="airTemp" title="Air Temperature" measurements={measurements} />
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <Chart state={state} sensor="airHum" title="Air Humidity" measurements={measurements} />
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <Chart state={state} sensor="UV" title="UV" measurements={measurements} />
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <Chart state={state} sensor="illumination" title="Illumination" measurements={measurements} />
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <Chart state={state} sensor="rain" title="Rain Intensity" measurements={measurements} />
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <Chart state={state} sensor="battery" title="Battery Level" measurements={measurements} />
          </Grid>
        </Grid>
      ) : (
        <DataTable measurements={measurements} />
      )}
    </Paper>
  );
};

export default App;
