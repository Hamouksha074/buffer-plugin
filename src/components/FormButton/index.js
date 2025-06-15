import React from "react";
import { connect } from "react-redux";
import {
  actionsRegistry,
  selectorsRegistry,
  withLocalize,
  systemAddNotification,
} from "@penta-b/ma-lib";
import { LOCALIZATION_NAMESPACE } from "../../constants/constants";
class FormButton extends React.Component {
  constructor(props) {
    super(props);
    this.openForm = this.openForm.bind(this);
    this.state = {
      isActive: false,
    };
    this.AddFormID = null;
  }
  openForm() {
    const { t, notify, LAYER } = this.props;
    const handleMapClick = (coords) => {
      const newFeat = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: coords.coordinate,
        },
        properties: { id: 123 },
      };
      this.props.showAddForm(
        {
          newFeat,
          LAYER,
          clear: () => {
            this.AddFormID && this.props.removeComponent(this.AddFormID);
            this.setState({
              ...this.state,
              isActive: false,
            });
          },
        },
        (id) => {
          this.AddFormID = id;
          thissetState({
            ...this.state,
            isActive: true,
          });
        }
      );
    };
    () => {
      this.AddFormID && this.props.removeComponent(this.AddFormID);
      this.setState({
        ...this.state,
        isActive: false,
      });
    };
    selectorsRegistry.unsubscribe("selectMapSingleClick", handleMapClick);
    if (this.state.isActive) {
      notify(t("Add a new point OFF"), "info");
      selectorsRegistry.unsubscribe("selectMapSingleClick", handleMapClick);
      this.setState({
        ...this.state,
        isActive: false,
      });
    } else {
      notify(t("Add a new point ON"), "info");
      selectorsRegistry.subscribe("selectMapSingleClick", handleMapClick);
      this.setState({
        ...this.state,
        isActive: true,
      });
    }
    render();
    return (
      <li on onClick={this.openForm}>
        Add new point
      </li>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {
    showAddForm: (props, onAdd, onRemove) =>
      dispatch(
        actionsRegistry.getActionCreator(
          "showComponent",
          LOCALIZATION_NAMESPACE,
          "Form",
          props,
          onAdd,
          onRemove
        )
      ),
    removeComponent: (id) =>
      dispatch(actionsRegistry.getActionCreator("removeComponent", id)),
    notify: (msg, type) => dispatch(systemAddNotification(msg, type)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(
  withLocalize(FormButton),
  LOCALIZATION_NAMESPACE
);
