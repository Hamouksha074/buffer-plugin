import React from "react";
import { Form } from "@penta-b/mna-penta-smart-forms";
import { LOCALIZATION_NAMESPACE } from "../../constants/constants";

class FormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.formData = {};
    this.OnSubmit = this.OnSubmit.bind(this);
  }

  OnSubmit() {
    console.log(this.formData);
  }
  render() {
    console.log(this.props);
    const schema = this.props.LAYER.basicSettings.ADD_FORM;

    return (
      <div style={{ padding: 20 }}>
        <div className="penta-container-center">
          <Form
            schema={schema}
            data={this.formData}
            namespace={LOCALIZATION_NAMESPACE}
          />
          <button className="penta-container-center" onClick={this.OnSubmit}>
            Add new point
          </button>
        </div>
      </div>
    );
  }
}

export default FormComponent;
