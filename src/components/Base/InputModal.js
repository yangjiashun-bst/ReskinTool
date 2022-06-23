import React from "react";
import {Button, Input, Modal} from "antd";

class InputModal extends React.PureComponent {
  state = {
    inputValue: "",
    visible: false
  }
  handleOnChange = (e) => {
    const {value} = e.target;
    this.setState({
      inputValue: value
    })
  }

  render() {
    const {title, placeholder, onOk} = this.props;
    const {inputValue, visible} = this.state

    return (
      <div>
        <Modal
          title={title}
          footer={null}
          visible={visible}
          onCancel={() => {
            this.setState({
              visible: false,
              inputValue: ""
            })
          }}
        >
          <Input placeholder={placeholder} value={inputValue} onChange={this.handleOnChange}/>
          <Button type="primary" shape="round" style={{marginLeft: 50, marginTop: 10}} onClick={() => {
            this.setState({
              visible: false
            })
            onOk(inputValue)
          }}>Save</Button>
        </Modal>
      </div>
    )
  }
}

export default InputModal
