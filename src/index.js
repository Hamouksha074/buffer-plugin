/**
 * Author: Amr Samir
 *
 * Description:
 *  - This index file exports plugin's components and/or reducers and/or actions.
 */
import MapClick from "./components/MapClick/MapClick.component";
import MapClickResult from "./components/MapClickResult/MapClickResult.component";
import Form from "./components/Form";
import defaultLocalization from "./messages";
import testingPluginReducer from "./reducers";
import * as testingPluginActions from "./actions";
import * as testingPluginSelectors from "./actions";
import { LOCALIZATION_NAMESPACE } from "./constants/constants";
MapClick.Title = LOCALIZATION_NAMESPACE + ":title";
MapClick.Icon = LOCALIZATION_NAMESPACE + ":icon";
const components = {
  MapClick,
  MapClickResult,
  Form,
};
const localization = {
  namespace: LOCALIZATION_NAMESPACE,
  defaultLocalization,
};
const reducers = { testingPluginReducer };
const actions = { ...testingPluginActions };
const selectors = { ...testingPluginSelectors };

export { components, localization, reducers, actions, selectors };
