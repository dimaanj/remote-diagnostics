import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import moment from "moment";
import "moment/locale/ru";
import { DtcLog } from "./DtcLog";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  tabsRoot: {
    flexGrow: 1,
  },
  tabStyle: {
    textTransform: "none",
  },
  spacer: {
    backgroundColor: "#c5cae9",
  },
}));

const ProgressIcon = ({ value }: any) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={value} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
};

export const VehicleDetails = () => {
  const classes = useStyles();
  const location = useLocation();
  const vehicle = (location as any).state.detail;
  const [tabNum, setTabNum] = useState(0);

  const handleChange = (event: any, newValue: any) => setTabNum(newValue);

  const getRow = (
    key: number,
    name: string,
    value: string,
    component?: any
  ) => {
    return (
      <React.Fragment key={key}>
        <ListItem>
          <ListItemText primary={`${name}: `} />
          {component ? (
            component
          ) : (
            <Typography gutterBottom variant="button">
              {value}
            </Typography>
          )}
        </ListItem>
        <Divider variant="middle" component="li" />
      </React.Fragment>
    );
  };

  const getGeneralInfoList = ({
    mark,
    model,
    vin_code,
    production_year,
    engine_volume,
    transmission,
    drive_unit,
    engine_type,
    imei_code,
    engine_state,
    mileage,
    remaining_fuel,
    battery_voltage,
  }: {
    drive_unit: "full" | "front" | "back";
    [key: string]: any;
  }) => {
    const list = [];

    const driveUnit = { full: "????????????", front: "????????????????", back: "????????????" };

    list.push(
      <Box
        height={50}
        display="flex"
        alignItems="center"
        justifyContent="center"
        className={classes.spacer}
      >
        <Typography>?????????????? ??????????????????</Typography>
      </Box>
    );

    list.push(getRow(10, "??????????????????", engine_state === "on" ? "??????." : "????????"));
    list.push(getRow(11, "????????????", `${mileage} ??????. ????.`));
    list.push(
      getRow(
        12,
        "??????????????",
        remaining_fuel,
        <ProgressIcon value={remaining_fuel} />
      )
    );
    list.push(
      getRow(
        13,
        "??????????????????????",
        battery_voltage,
        <ProgressIcon value={Number(battery_voltage)} />
      )
    );

    list.push(
      <Box
        height={50}
        display="flex"
        alignItems="center"
        justifyContent="center"
        className={classes.spacer}
      >
        <Typography>?????????? ????????????????????</Typography>
      </Box>
    );

    list.push(getRow(1, "??????????", mark));
    list.push(getRow(2, "????????????", model));
    list.push(getRow(3, "VIN ??????", vin_code));
    list.push(
      getRow(
        4,
        "???????? ??????????????",
        moment(production_year).locale("ru ").format("LLL")
      )
    );
    list.push(getRow(5, "?????????? ??????????????????", `${engine_volume} ??.`));
    list.push(
      getRow(
        6,
        "?????????????? ??????????????",
        transmission === "auto" ? "????????????????????????????" : "????????????????????????"
      )
    );
    list.push(getRow(7, "????????????", driveUnit[drive_unit]));
    list.push(getRow(8, "?????? ??????????????????", engine_type));
    list.push(getRow(9, "IMEA ?????? ????????????", imei_code));

    return list;
  };

  return (
    <React.Fragment>
      <Paper className={classes.tabsRoot}>
        <Tabs
          value={tabNum}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab
            className={classes.tabStyle}
            label={<Typography variant="body1">?? ????????????</Typography>}
          />
          <Tab
            className={classes.tabStyle}
            label={<Typography variant="body1">???? ??????????</Typography>}
          />
          <Tab
            className={classes.tabStyle}
            label={<Typography variant="body1">???????????? ????????????.</Typography>}
          />
        </Tabs>
      </Paper>

      {tabNum === 0 && (
        <List className={classes.root}>{getGeneralInfoList(vehicle)}</List>
      )}
      {tabNum === 2 && <DtcLog id={vehicle.id} />}
    </React.Fragment>
  );
};
