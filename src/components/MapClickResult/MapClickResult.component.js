import React from 'react';
import { withLocalize, componentRegistry } from '@penta-b/ma-lib';
import { LOCALIZATION_NAMESPACE } from '../../constants/constants';
import { connect } from 'react-redux';
import { components } from '@penta-b/grid';
import { selectFeatures } from '../../selectors';
const ZoomToFeatureButton = componentRegistry.getComponent("ZoomToFeatureButton");
const HighlightFeatureButton = componentRegistry.getComponent("HighlightFeatureButton");
const Grid = components.Grid;

class MapClickResult extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.features);
    }
    
    render() {
        const { coordinate, t} = this.props;
        return (
            <div>
                {
                    t('click.msg', {
                        '0': coordinate[0],
                        '1': coordinate[1]
                    })
                }
                <br />
                {
                    t('test.plurals', {
                        '0': 1,
                        '1': 5
                    })
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        features: selectFeatures(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showMapClickResult: (props, onAdd, onRemove) =>
            dispatch(
                componentRegistry.getActionCreator(
                    "showComponent",
                    "Mouksha",
                    "MapClickResult",
                    props,
                    onAdd,
                    onRemove,
                )
            ),
        removeMapClickResult: (id) =>
            dispatch(componentRegistry.getActionCreator("removeComponent", id)),
        removeComponent: (id) =>
            dispatch(componentRegistry.getActionCreator("removeComponent", id)),
    };
};

class TriggerResult extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { t, features } = this.props;
        const featuresProps = (features || []).map((f) => ({ ...f.properties, key: f.id }));
        return (
            <div>
                <Grid
                    settings={{   
                        name: "buffer data",
                        rowIdentifier: "id",
                        selectable: true,
                        filterable: true,
                        enableLargeView: true,
                        maxComponent: 3,
                        resizable: true,
                        columns: [
                            {
                                id: "id",
                                name: t("id"),
                                type: "string",
                                display: "basic",
                                filterable: true,
                                sortable: false,
                            },
                            {
                                id: "marker_name",
                                name: t("marker name"),
                                type: "string",
                                display: "basic",
                                filterable: true,
                                sortable: false,
                            },
                            // {
                            //     id: "features",
                            //     name: "",
                            //     type: "component",
                            //     display: "basic",
                            //     filterable: false,
                            //     sortable: false,
                            // },
                    ],
                        data: featuresProps,
                    }}
                />
            </div>
        );
    }
}
const trComponents = [
    { component: ZoomToFeatureButton, settings: {} },
    { component: HighlightFeatureButton, settings: {} }
];
const gridComponents = [
    { component: ZoomToFeatureButton, settings: {} },
    { component: HighlightFeatureButton, settings: {} }
];
function MyComponent({ trComponents, gridComponents }) {
    return (
        <div>
            <h2>TR Components</h2>
            {trComponents.map((item, index) => (
                <item.component key={index} {...item.settings} />
            ))}
            
            <h2>Grid Components</h2>
            {gridComponents.map((item, index) => (
                <item.component key={index} {...item.settings} />
            ))}
        </div>
    );
}
<MyComponent 
trComponents={trComponents}
gridComponents={gridComponents}
/>
const ConnectedTriggerResult = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withLocalize(TriggerResult, LOCALIZATION_NAMESPACE));
export default ConnectedTriggerResult;
export { MapClickResult };
export { ZoomToFeatureButton };
export { HighlightFeatureButton };
export { Grid };
export { trComponents, gridComponents };