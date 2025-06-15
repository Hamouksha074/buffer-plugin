import React from "react";
import { withLocalize, componentRegistry } from "@penta-b/ma-lib";
import { components } from "@penta-b/grid";
import { connect } from "react-redux";

import {
  ZOOM_TO_FEATURE_BUTTON,
  HIGHLIGHT_FEATURE_BUTTON,
  CLEAR_HIGHLIGHT_BUTTON,
  LOCALIZATION_NAMESPACE,
} from "../../constants/constants.js";
import FormButton from "../FormButton/index.js";
const Grid = components.Grid;

const ZoomToFeatureButton = componentRegistry.getComponent(
  ZOOM_TO_FEATURE_BUTTON
);
const HighlightFeatureButton = componentRegistry.getComponent(
  HIGHLIGHT_FEATURE_BUTTON
);
const ClearHighlightButton = componentRegistry.getComponent(
  CLEAR_HIGHLIGHT_BUTTON
);
class MapClickResult extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("MapClickResult", this.props);
    const { response, settings } = this.props;
    if (!response && !response.length) {
      return (
        <div>
          <h1>no data</h1>
        </div>
      );
    }
    const gridComponents = [
      { component: ZoomToFeatureButton, settings: {} },
      { component: HighlightFeatureButton, settings: {} },
      {
        component: FormButton,
        settings: {
          LAYER: settings?.dataSettings?.LAYER,
        },
      },
    ];

    const newResponse = response.map((item) => {
      const newItem = { ...item, ...item.properties };

      return newItem;
    });
    return (
      <div>
        <br />
        <Grid
          style={{ color: "red" }}
          settings={{
            name: "information under selected area",

            rowIdentifier: "id",

            selectable: false,

            sortable: true,

            filterable: true,

            enableLargeView: true,

            maxComponent: 10,

            resizable: true,

            columns: [
              {
                id: "gov_code",

                name: "gov_code",

                type: "string",

                display: "basic",

                filterable: true,

                sortable: false,
              },

              {
                id: "id",

                name: "id",

                type: "string",

                display: "basic",

                filterable: false,

                sortable: true,
              },

              {
                id: "ssec_name_a",

                name: "ssec_name_a",

                type: "string",

                display: "basic",

                filterable: false,

                sortable: true,
              },

              {
                id: "name_en",

                name: "en name",

                type: "string",

                display: "basic",

                filterable: false,

                sortable: true,
              },
              {
                id: "grid_action",
                name: "options",
                type: "component",
                display: "basic",
                filterable: false,
                sortable: false,
              },
            ],
            data: newResponse,
          }}
          trComponents={[
            { component: ZoomToFeatureButton, settings: {} },
            { component: HighlightFeatureButton, settings: {} },
            { component: ClearHighlightButton, settings: {} },
          ]}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    res: state.mapClickResult,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    removeMapClickResult: (id) => {
      dispatch({ type: "REMOVE_MAP_CLICK_RESULT", id });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLocalize(MapClickResult, LOCALIZATION_NAMESPACE));
