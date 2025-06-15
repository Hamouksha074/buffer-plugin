import React from "react";
import { connect } from "react-redux";
import {
  selectorsRegistry,
  actionsRegistry,
  apiRegistry,
} from "@penta-b/ma-lib";
import { callQueryService } from "../../services/queryService.js";
import * as turf from "@turf/turf";
import {
  DRAWING,
  INIT_DRAWING,
  STROKE_COLOR,
} from "../../constants/constants.js";
import { drawFeature } from "../../services/mapUtils.js";
class MapClickResult extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    vectorLayer: {},
    isInteractionAdded: false,
  };

  componentDidUpdate(prevProps) {
    console.log(this.prevProps, "prevProps");
    const { addInteraction, isActive } = this.props;
    console.log(">>>>>>>>props", this.props, "props");
    const layer = this.props.settings?.dataSettings?.LAYER;
    const { isInteractionAdded } = this.state;

    if (!isActive) return;
    if (this.props.isActive) {
      const prevClick = prevProps.singleClick;
      const currentClick = this.props.singleClick;
      if (currentClick && currentClick != prevClick) {
        this.id && this.props.removeMapClickResult(this.id);
        this.props.showMapClickResult(
          {
            coordinate: currentClick.coordinate,
          },
          (id) => (this.id = id)
        );
      }
    }
    if (!isInteractionAdded) {
      return apiRegistry.getApis(INIT_DRAWING).then(([Drawing] = []) => {
        this.drawing = new Drawing({ type: "point" });
        this.drawing.setOnInteractionRemoved(this.props.deactivate);
        addInteraction(this.drawing);
        this.setState({ ...this.state, isInteractionAdded: true });
      });
    }

    const prevClick = prevProps.singleClick;
    const currentClick = this.props.singleClick;

    if (
      (!currentClick && !prevClick) ||
      JSON.stringify(currentClick) === JSON.stringify(prevClick)
    )
      return;

    if (this.id) {
      this.props.removeMapClickResult(this.id);
    }
    const point = turf.point(currentClick.coordinate);
    const buffered = turf.buffer(point, 50);

    drawFeature([buffered], {
      vectorLayerOptions: {
        clear: false,
      },
      styleOptions: {
        color: "#00ff00",
        isFile: false,
      },
    });

    apiRegistry
      .getApis(DRAWING)
      .then(([Feature, Style, Fill, Stroke, Circle, VectorLayer]) => {
        const featureRefrance = new Feature(buffered);
        const options = { Stroke: STROKE_COLOR, PointRadius: 3000 };
        const featureStyle = new Style(
          new Fill("#e9124270"),
          new Stroke(options.Stroke, 4),
          new Circle(
            new Fill("#e9124270"),
            new Stroke(options.Stroke, 4),
            options.PointRadius
          ),
          null
        );

        featureRefrance.setStyle(featureStyle);
        const vl = new VectorLayer();
        this.props.removeVectorLayer(this.state.vectorLayer.value);
        this.props.addVectorLayer(vl);
        this.setState({
          ...this.state,
          vectorLayer: {
            ...this.state.vectorLayer,
            value: vl,
          },
        });

        vl.addFeature(featureRefrance);
      });

    callQueryService(layer, buffered).then((response) => {
      console.log(response, "><<<<<>>>>>>>>>response");
      if (!response || response.length === 0) {
        this.props.notify("No data found", "warning");
        this.props.removeMapClickResult(this.id);
        this.props.removeVectorLayer(this.state.vectorLayer.value);
        this.setState({
          ...this.state,
          vectorLayer: {},
        });
        return;
      }
      this.props.showMapClickResult(
        { response: response },
        (id) => (this.id = id),
        (id) => {
          this.props.removeMapClickResult(id);
          this.props.removeVectorLayer(this.state.vectorLayer.value);
          this.setState({
            ...this.state,
            vectorLayer: {},
          });
        }
      );
    });
  }
  render() {
    return null;
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    singleClick: selectorsRegistry.getSelector(
      "selectMapSingleClick",
      state,
      ownProps.reducerId
    ),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addInteraction: (interaction) =>
      dispatch(actionsRegistry.getActionCreator("addInteraction", interaction)),
    setFeatures: (features) => dispatch(setFeatures(features)),
    showMapClickResult: (props, onAdd, onRemove) =>
      dispatch(
        actionsRegistry.getActionCreator(
          "showComponent",
          "Mouksha1",
          "MapClickResult",
          props,
          onAdd,
          onRemove
        )
      ),
    removeMapClickResult: (id) =>
      dispatch(actionsRegistry.getActionCreator("removeComponent", id)),
    addVectorLayer: (layer) =>
      dispatch(actionsRegistry.getActionCreator("addVectorLayer", layer)),
    removeVectorLayer: (layer) =>
      dispatch(actionsRegistry.getActionCreator("removeVectorLayer", layer)),
    removeComponent: (id) =>
      dispatch(actionsRegistry.getActionCreator("removeComponent", id)),
    setFeatures: (features) => dispatch(setFeatures(features)),
    notify: (message, type) => {
      dispatch(
        systemAddNotification({
          message,
          type,
        })
      );
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MapClickResult);
