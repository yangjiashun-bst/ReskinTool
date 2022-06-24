import React from "react"
import {Checkbox, Col, Image, Row, Typography, Button, Radio} from "antd";
import {
  EditOutlined
} from '@ant-design/icons';
import {getFileNameAndSuffix, isGLBFile} from "@/utils/utils";
class PreviewImageItem extends React.PureComponent{
  render() {
    const {path,onClick,isNotEdit} = this.props
    const imageId = getFileNameAndSuffix(path)
    const isGLB = isGLBFile(path);
    return(
      <Col span={11} style={{marginTop:5}}>
        <Row gutter={[2,5]}>
          <Col span={24}>
            <Image
              style={{
                width:90,
                height:90,
                objectFit:"contain"
              }}

              src={isGLB?"/glb_logo.png":"file:///"+path}
            />
          </Col>
          <Col span={24}>
            <Radio value={imageId}><Typography.Text style={{width:70}} ellipsis={{
            tooltip: `${imageId}`
            }}>{imageId}</Typography.Text></Radio>
          </Col>
          {isNotEdit||isGLB?"":(
            <Col span={24}>
              <Button type="primary" onClick={()=>{
                onClick(path)
              }} icon={<EditOutlined />} size="small">Edit</Button>
            </Col>
          )}
        </Row>
      </Col>

    )
  }
}
export default PreviewImageItem
