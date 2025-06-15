import {
  store,
  query,
  systemShowLoading,
  systemHideLoading,
} from "@penta-b/ma-lib";
const genQueryBody = (layer, buffered) => {
  return [
    {
      dataSource: {
        id: "00627602-62a4-44c6-8d3d-fd51cdc60577",
      },
      filter: {
        conditionList: [
          {
            tabularCondition: {
              key: "gov_name",
              dataType: "string",
              operator: "like",
              value: "%القاهره%",
            },
          },
        ],
        logicalOperation: "OR",
      },
      crs: "EPSG:32636",
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
