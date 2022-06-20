import React from "react"
import {Button, Col, Form, Input, Modal, Row, Typography, message, Layout} from "antd"
import RectCanvas from "@/components/Base/RectCanvas";
import {getFileNameAndSuffix, getFilePathById, getUUID, isJSON} from "@/utils/utils";
import {MODAL_HEIGHT, MODAL_WIDTH} from "@/utils/globalConst";
import {DeleteOutlined} from "@ant-design/icons";
import styles from './index.less'

const formLayout = {
  labelCol: {span: 3},
  wrapperCol: {span: 5},
};

class PreviewDrawRectModal extends React.PureComponent {
  formRef = React.createRef()
  formJSONRef = React.createRef()
  constructor(props) {
    super(props);
    this.state = ({
      area: null,
      areaList: [],
      status: "completed",
      visible: false,
      path: ""
    })

  }

  handlePositionChange = (position) => {
    const {area, status} = this.state
    if (status !== "add") {
      return
    }
    this.formRef.current.setFieldsValue({
      ...position
    });
    this.setState({
      area: {...area, ...position}
    })
  }

  handleAddJSONClick = () => {
    this.setState({
      status: "add_json"
    })
  }
  handleAddClick = () => {
    this.setState({
      status: "add"
    })
  }
  handleCompleteClick = () => {
    let {areaList,status} = this.state
    if(status === "add") {
      this.formRef.current.validateFields().then(values => {
        areaList.push({
          x: parseInt(values.x),
          y: parseInt(values.y),
          w: parseInt(values.w),
          h: parseInt(values.h),
        })
        this.setState({
          status: "completed",
          areaList,
          area: null
        })

      }).catch(info => {
        console.log("err", info)
      })
    } else if(status === "add_json") {
      this.formJSONRef.current.validateFields().then(values=>{
        console.log("values",values)
        const {json} = values
          if(isJSON(json)) {
             areaList = JSON.parse(json);
            this.setState({
              status: "completed",
              areaList
            })
          } else {
            message.error("json format error")
          }
      }).catch(info=>{
        console.log("err", info)
      })
    }

  }

  handleDeleteClick = (index) => {
    let {areaList} = this.state
    areaList = areaList.filter((item, i) => i !== index)
    this.setState({
      areaList
    })
  }

  handleOnOk = () => {

    const {areaList, path} = this.state
    const {onOk} = this.props
    if (!areaList || areaList.length === 0) {
      message.warn("Please add config area")
      return
    }
    const imageId = getFileNameAndSuffix(path)
    this.setState({
      visible: false
    })
    onOk(imageId, areaList)
  }
  getStatusEle = () => {
    const {status,area} = this.state
    if(status === "add") {
      return (
        <Row style={{marginTop: 10}}>
          <Form
            ref={this.formRef}>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="X:"
                  rules={[{required: true, message: "Please input X!"}]}
                  name="x">
                  <Input onChange={(e) => {
                    this.setState({
                      area: {...area, x: parseInt(e.target.value)}
                    })
                  }}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Y:"
                  name="y"
                  rules={[{required: true, message: "Please input Y!"}]}>
                  <Input onChange={(e) => {
                    this.setState({
                      area: {...area, y: parseInt(e.target.value)}
                    })
                  }}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="W:"
                  name="w"
                  rules={[{required: true, message: "Please input W!"}]}>
                  <Input onChange={(e) => {
                    this.setState({
                      area: {...area, w: parseInt(e.target.value)}
                    })
                  }}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="H:"
                  name="h"
                  rules={[{required: true, message: "Please input H!"}]}>
                  <Input onChange={(e) => {
                    this.setState({
                      area: {...area, h: parseInt(e.target.value)}
                    })
                  }}/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Row>
      )
    } else if(status === "add_json") {
        return (
          <Row style={{marginTop: 10}}>
            <Form
              ref={this.formJSONRef}>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="JSON:"
                    rules={[{required: true, message: "Please input JSON!"}]}
                    name="json">
                    <Input.TextArea autoSize={{
                      minRows:7,
                      maxRows:14
                    }}/>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Row>
        )
    }
  }

  render() {
    const {area, areaList, visible, path} = this.state

    return (
      <div>
        {visible ? (
          <Modal
            title={"Edit Area"}
            maskClosable={false}
            visible={true}
            width={MODAL_WIDTH}
            height={MODAL_HEIGHT}
            style={{top: 1}}
            footer={null}
            onCancel={() => {
              this.setState({visible: false})
            }}
          >
            <Row gutter={[20, 20]}>
              <Col span={6}>
                <Typography.Text>Please click &apos;Add&apos; to select the config area.</Typography.Text>
                <Row style={{marginBottom: 10}}>

                  <Button type="primary" onClick={this.handleAddClick} shape="round" size={"small"} style={{marginLeft: 10}}>Add</Button>
                  <Button type="primary" onClick={this.handleCompleteClick} shape="round" size={"small"}
                          style={{marginLeft: 10}}>Complete</Button>
                </Row>
                {
                  areaList.map((item, index) => {
                    return (
                      <Row gutter={4} key={getUUID()}>
                        <Col span={5} className={styles.areaCol}>X:{item.x}</Col>
                        <Col span={5} className={styles.areaCol}>Y:{item.y}</Col>
                        <Col span={5} className={styles.areaCol}>W:{item.w}</Col>
                        <Col span={5} className={styles.areaCol}>H:{item.h}</Col>
                        <Col span={4}><Button icon={<DeleteOutlined/>} size={"small"} onClick={() => {
                          this.handleDeleteClick(index)
                        }}/></Col>
                      </Row>
                    )
                  })
                }
                {this.getStatusEle()}
                <Row style={{
                  position: "absolute",
                  bottom: 10,
                }}>
                  <Button type="primary" shape="round" onClick={this.handleAddJSONClick} style={{marginTop: 10,marginLeft:10}}>Add JSON</Button>
                  <Button type="primary" shape="round" onClick={this.handleOnOk} style={{marginTop: 10,marginLeft:10}}>Save</Button>
                </Row>
              </Col>
              <Col span={18}>
                <RectCanvas
                  path={path}
                  areaList={areaList}
                  position={area}
                  handlePositionChange={this.handlePositionChange}
                />
              </Col>
            </Row>
          </Modal>
        ) : ""}
      </div>


    )
  }
}

export default PreviewDrawRectModal
