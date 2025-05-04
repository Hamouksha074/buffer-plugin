import {
    store,
    query,
    systemShowLoading,
    systemHideLoading,
} from "@penta-b/ma-lib";
const genQueryBody = (layer) => {
    return [
        {
            dataSource: {
                id: layer.id,
            },
            crs: layer.crs,
        },
    ];
}
export const callQueryService = async (layer) => {
    try {
        store.dispatch(systemShowLoading());
        const response = await query.queryFeatures(genQueryBody(layer));
        
        if (!response?.data?.[0]?.features) {
            throw new Error("Invalid response structure");
        }

        const features = JSON.parse(response.data[0].features).features;
        return features || [];
    } catch (error) {
        return [];
    } finally {
        store.dispatch(systemHideLoading());
    }
};