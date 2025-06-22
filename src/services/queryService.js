import {
  store,
  query,
  systemShowLoading,
  systemHideLoading,
} from "@penta-b/ma-lib";
const genQueryBody = (layer, buffered) => {
  console.log("genQueryBody", layer, buffered);
  if (!layer) {
    throw new Error("Layer is required to generate query body");
  }
  return [
    {
      dataSource: {
        id: layer.id || "00627602-62a4-44c6-8d3d-fd51cdc60577",
      },
      filter: {
        logicalOperation: "AND",
        conditionList: [
          {
            spatialCondition: {
              key: layer.geometryField.fieldName || "geometry",
              geometry: JSON.stringify(buffered?.geometry) || null,
              spatialRelation: "INTERSECT",
            },
          },
        ],
      },
      crs: layer.crs || "EPSG:4326",
    },
  ];
};
export const callQueryService = async (layer, buffered) => {
  try {
    store.dispatch(systemShowLoading());
    const response = await query.queryFeatures(genQueryBody(layer, buffered));

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
