import{
    apiRegistry,
    actionsRegistry,
} from "@penta-b/ma-lib";
let VL = null;
const validateVL = async (options) => {
    if (!VL) {
        await apiRegistry.getApis(["VectorLayer"]).then(([VectorLayers]) => {
            VL = new VectorLayers();
            actionsRegistry.dispatch("addVectorLayer", VL);
        });
    } else {
    options.clear && VL.clear();

    }
};
const generateStyle = async (styleOptions) => {
    return await apiRegistry 
    .getApis(["Style", "Fill", "Stroke", "Circle"])
    .then(([Style, Fill, Stroke, Circle]) =>{
        let style;
        if (styleOptions.isFile) {
            style = new Style.createStyle({
                icon: styleOptions.iconSrc,
            })
        } else {
            style = new Style(
                null,
                null,
                new Circle(
                    new Fill (styleOptions.color),
                    new Stroke ("#000000", 1, null),
                    7
                )
            );
        }
        return style;
    })
}
export const generateFeature = async (geoJSONFeature) => {
    return await apiRegistry
        .getApis(["Feature", "GeoJSON"])
        .then(([Feature, GeoJSON]) => {
            const geojson = new GeoJSON(geoJSONFeature);
            return new Feature(geojson);
        });
}
export const drawFeature = async (geoJSONFeature, options) => {
    await validateVL(options.vectorLayerOptions);
    const features = await Promise.all(geoJSONFeature.map(generateFeature));
    const style = await generateStyle(options.styleOptions);
    VL.setStyle(style);
    VL.addFeatures(features);
};