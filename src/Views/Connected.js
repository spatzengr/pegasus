import React, { Component } from "react";
import Drawer from "@material-ui/core/Drawer";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";
import theme from "../Themes/Dark";
import VersionInfoView from "./VersionInfoView";
import AuxChannelView from "./AuxChannelView/AuxChannelView";
import ConfigListView from "./ConfigListView/ConfigListView";
import FeaturesView from "./FeaturesView/FeaturesView";
import PortsView from "./PortsView/PortsView";
import CliView from "./CliView/CliView";
import FiltersView from "./FiltersView/FiltersView";
import PidsView from "./PidView/PidView";
import RatesView from "./RatesView/RatesView";
import AppBarView from "./AppBarView/AppBarView";

const skipprops = [
  "pid_profile",
  "rate_profile",
  "modes",
  "features",
  "ports",
  "imuf",
  "name",
  "version",
  "pidProfileList",
  "rateProfileList",
  "currentPidProfile",
  "currentRateProfile",
  "startingRoute",
  "tpa_curves",
  "pinio_box",
  "pinio_config"
];
const getRouteItems = (routeName, fcConfig) => {
  return Object.keys(fcConfig)
    .filter(key => {
      if (routeName === "ADVANCED") {
        return skipprops.indexOf(key) < 0 && !fcConfig[key].route;
      }
      return fcConfig[key].route === routeName;
    })
    .map(k => fcConfig[k]);
};

export default class Connected extends Component {
  constructor(props) {
    super(props);
    this.fcConfig = props.fcConfig;
    this.goToDFU = props.goToDFU;
    this.goToImuf = props.goToImuf;

    this.routes = this.fcConfig.routes;
    this.state = {
      pid_profile: this.fcConfig.currentPidProfile,
      rate_profile: this.fcConfig.currentRateProfile,
      craftName: this.fcConfig.name,
      isDirty: false,
      drawerOpen: false,
      currentRoute: this.fcConfig.startingRoute
    };
  }

  handleDrawerToggle = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };
  handleSearch = () => {
    //TODO: filter config values based on text.
  };

  handleMenuItemClick = event => {
    let newRoute = this.routes.find(
      route => route.key === event.currentTarget.id
    );
    this.setState({
      drawerOpen: false,
      currentRoute: newRoute
    });
  };

  notifyDirty = (isDirty, item, newValue) => {
    let updateObj = {
      isDirty: isDirty
    };
    updateObj[item.id] = newValue;
    this.setState(updateObj);
  };
  render() {
    let contents;
    switch (this.state.currentRoute.key) {
      case "PID": {
        let mergedProfile = Object.assign(
          {},
          this.fcConfig,
          this.fcConfig.pid_profile.values[this.state.pid_profile]
        );
        contents = (
          <PidsView
            fcConfig={this.fcConfig}
            notifyDirty={(isDirty, item, newValue) =>
              this.notifyDirty(isDirty, item, newValue)
            }
            id={"pid_profile"}
            active={this.state.pid_profile}
            profileList={this.fcConfig.pidProfileList}
            items={getRouteItems(this.state.currentRoute.key, mergedProfile)}
          />
        );
        break;
      }
      case "RATES": {
        let mergedProfile = Object.assign(
          {},
          this.fcConfig,
          this.fcConfig.rate_profile.values[this.state.rate_profile]
        );
        contents = (
          <RatesView
            fcConfig={this.fcConfig}
            notifyDirty={(isDirty, item, newValue) =>
              this.notifyDirty(isDirty, item, newValue)
            }
            id={"rate_profile"}
            active={this.state.rate_profile}
            profileList={this.fcConfig.rateProfileList}
            items={getRouteItems(this.state.currentRoute.key, mergedProfile)}
          />
        );
        break;
      }
      case "MODES":
        contents = (
          <AuxChannelView
            modes={this.fcConfig.modes.values}
            notifyDirty={(isDirty, item, newValue) =>
              this.notifyDirty(isDirty, item, newValue)
            }
          />
        );
        break;
      case "PORTS":
        contents = (
          <PortsView
            rxProvider={this.fcConfig.serialrx_provider}
            ports={this.fcConfig.ports.values}
            notifyDirty={(isDirty, item, newValue) =>
              this.notifyDirty(isDirty, item, newValue)
            }
          />
        );
        break;
      case "FEATURES":
        contents = (
          <FeaturesView
            features={this.fcConfig.features.values}
            notifyDirty={(isDirty, item, newValue) =>
              this.notifyDirty(isDirty, item, newValue)
            }
          />
        );
        break;
      case "FILTERS":
        contents = (
          <FiltersView
            fcConfig={this.fcConfig}
            features={this.fcConfig.features.values}
            notifyDirty={(isDirty, item, newValue) =>
              this.notifyDirty(isDirty, item, newValue)
            }
          />
        );
        break;
      default:
        contents = (
          <ConfigListView
            notifyDirty={(isDirty, item, newValue) =>
              this.notifyDirty(isDirty, item, newValue)
            }
            items={getRouteItems(this.state.currentRoute.key, this.fcConfig)}
          />
        );
        break;
    }
    return (
      <Paper
        theme={theme}
        elevation={3}
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          flex: "1",
          padding: "30px 10px 10px 10px",
          minHeight: "100%",
          boxSizing: "border-box"
        }}
      >
        <AppBarView
          position="absolute"
          handleDrawerToggle={this.handleDrawerToggle}
          handleSearch={this.handleSearch}
          title={this.state.currentRoute.title}
          fcConfig={this.fcConfig}
          notifyDirty={this.notifyDirty}
          isDirty={this.isDirty}
        />
        <Drawer
          open={this.state.drawerOpen}
          onClose={() => {
            this.setState({ drawerOpen: false });
          }}
        >
          <Divider style={{ marginTop: "30px" }} />
          <VersionInfoView
            goToDFU={this.goToDFU}
            goToImuf={this.goToImuf}
            version={this.fcConfig.version}
            imuf={this.fcConfig.imuf}
          />
          <Divider />
          {this.routes.map(route => {
            return (
              <MenuItem
                id={route.key}
                key={route.key}
                onClick={this.handleMenuItemClick}
              >
                <List style={{ display: "flex" }}>
                  <div style={{ flex: 1 }}>{route.title}</div>
                  {route.incompeteItems && (
                    <Badge
                      style={{ top: "12px" }}
                      badgeContent={route.incompeteItems}
                      secondary={true}
                    />
                  )}
                </List>
              </MenuItem>
            );
          })}
        </Drawer>
        {contents}
        <CliView />
      </Paper>
    );
  }
}
