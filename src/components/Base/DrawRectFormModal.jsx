import React from "react"
import {Button, Col, Form, Input, Modal, Row, Typography} from "antd"
import RectCanvas from "@/components/Base/RectCanvas";
import {getFilePathById} from "@/utils/utils";
import {MODAL_HEIGHT, MODAL_WIDTH} from "@/utils/globalConst";

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
class DrawRectFormModal extends React.PureComponent{
  formRef = React.createRef()
  constructor(props) {
    super(props);
    this.state = ({
      selectItem:null,
      visible:false
    })
  }
  handleOnOk =()=>{
    const {selectItem} = this.state
    const {onOk} = this.props
    this.formRef.current.validateFields().then(values=>{
      this.setState({
        visible:false
      })
      onOk(selectItem)
    }).catch(err=>{
       console.log("err",err)
    })

  }
  handlePositionChange=(position)=>{
      const {selectItem} = this.state

      this.formRef.current.setFieldsValue({
        ...position
      });
      this.setState({
        selectItem:{...selectItem,...position}
      })
  }

  render() {
    const {dirFileList} = this.props
    const {selectItem,visible} = this.state
    return(
      <div>
        {
          visible?(
            <Modal
              title={"Edit Reskin"}
              maskClosable={false}
              visible={visible}
              width={MODAL_WIDTH}
              height={MODAL_HEIGHT}
              style={{top:1}}
              footer={null}
              onOk={this.handleOnOk}
              onCancel={()=>{
                this.setState({visible:false})
              }}>
              <Row gutter={[20,20]}>
                <Col span={6} >
                  <Typography.Text >Select the config area.</Typography.Text>
                  <Form
                    ref={this.formRef}
                    style={{marginTop:10}}
                    initialValues={selectItem}
                    {...formLayout}>
                    <Form.Item
                      label="X:"
                      rules={[{required:true,message:"Please input X!"}]}
                      name="x">
                      <Input onChange={(e)=>{
                        console.log("x change",e.target.value)
                        this.setState({
                          selectItem:{...selectItem,x:parseInt(e.target.value)}
                        })
                      }} />
                    </Form.Item>
                    <Form.Item
                      label="Y:"
                      name="y"
                      rules={[{required:true,message:"Please input Y!"}]}>
                      <Input onChange={(e)=>{
                        console.log("y change",e.target.value)
                        this.setState({
                          selectItem:{...selectItem,y:parseInt(e.target.value)}
                        })
                      }}/>
                    </Form.Item>
                    <Form.Item
                      label="W:"
                      name="w"
                      rules={[{required:true,message:"Please input W!"}]}>
                      <Input onChange={(e)=>{
                        console.log("w change",e.target.value)
                        this.setState({
                          selectItem:{...selectItem,w:parseInt(e.target.value)}
                        })
                      }}/>
                    </Form.Item>
                    <Form.Item
                      label="H:"
                      name="h"
                      rules={[{required:true,message:"Please input H!"}]}>
                      <Input onChange={(e)=>{
                        console.log("h change",e.target.value)
                        this.setState({
                          selectItem:{...selectItem,h:parseInt(e.target.value)}
                        })
                      }}/>
                    </Form.Item>
                    <Form.Item
                      label="SW:"
                      name="textureCrcSW">
                      <Input readOnly />
                    </Form.Item>
                    <Form.Item
                      label="SH:"
                      name="textureCrcHW">
                      <Input readOnly  />
                    </Form.Item>
                  </Form>
                  <Button type="primary" style={{marginLeft:50,marginTop:50}} onClick={this.handleOnOk}>Save</Button>
                </Col>
                <Col span={18}>
                  <RectCanvas
                    path={getFilePathById(dirFileList,selectItem.textureCrcHW)}
                    handlePositionChange={this.handlePositionChange}

                    position={{x:selectItem.x,y:selectItem.y,w:selectItem.w,h:selectItem.h}}
                  />
                </Col>
              </Row>
            </Modal>
          ):""
        }

      </div>
    )
  }
}

export default DrawRectFormModal
