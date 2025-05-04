/**
 * Author: Amr Samir
 * 
 * Description: 
 *  - An example of a plugin that listens to another 
 *    plugin's state changes (Map plugin), and log that state.
 */


import React from 'react';
import { connect } from 'react-redux';
import { selectorsRegistry, actionsRegistry, systemAddNotification } from '@penta-b/ma-lib';
import { callQueryService } from '../../services/queryService';
import { drawFeature } from '../../services/mapUtils';
import { setFeatures } from '../../actions';


class MapClickComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const { name } = this.props.settings.dataSettings;
        const { POINT_SHAPE, POINT_COLOR, POINT_IMAGE } = name.basicSettings;
        callQueryService(name).then(async (GEOJSONFeatures) => {
            if (!GEOJSONFeatures) 
                return this.props.notify("ISSUE WITH REQUEST", "error");
            this.props.setFeatures(GEOJSONFeatures);
            await
            drawFeature(GEOJSONFeatures, {
                vectorLayerOption: {clear: false},
                styleOptions: {
                    isFile: POINT_SHAPE === "img",
                    color: POINT_COLOR,
                    iconSrc: POINT_IMAGE,
                },
            });
        });
    };
    
    componentDidUpdate(prevProps) {
        if (this.props.isActive) {
            const prevClick = prevProps.singleClick;
            const currentClick = this.props.singleClick;
            if (currentClick && currentClick != prevClick) {
                this.id && this.props.removeMapClickResult(this.id);
                this.props.showMapClickResult({
                    coordinate: currentClick.coordinate
                }, id => this.id = id);
            }
        }
    }
    render() {
        return null;
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        singleClick: selectorsRegistry.getSelector('selectMapSingleClick', state, ownProps.reducerId)
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        setFeatures: (features) => dispatch(setFeatures(features)),
        showMapClickResult: (props, onAdd, onRemove) => dispatch(actionsRegistry.getActionCreator('showComponent', 'Mouksha', 'MapClickResult', props, onAdd, onRemove)),
        removeMapClickResult: (id) => dispatch(actionsRegistry.getActionCreator('removeComponent', id)),
        removeComponent: (id) => dispatch(actionsRegistry.getActionCreator('removeComponent', id)),
        setFeatures: (features) => dispatch(setFeatures(features)),
        notify: (message, type) => {
            dispatch(
                systemAddNotification({
                    message,
                    type,
                })
            );
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(MapClickComponent);