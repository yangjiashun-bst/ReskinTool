import React from "react"
import {Checkbox, Col, Image, Row, Typography, Button, Radio} from "antd";
import {
  EditOutlined, PlusOutlined
} from '@ant-design/icons';
import {getFileNameAndSuffix, getUUID} from "@/utils/utils";
class PreviewImageItem extends React.PureComponent{
  render() {
    const {path,onClick} = this.props
    const imageId = getFileNameAndSuffix(path)
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
              src={"file:///"+path}
            />
          </Col>
          <Col span={24}>
            <Radio value={imageId}><Typography.Text style={{width:70}} ellipsis={{
            tooltip: `${imageId}`
            }}>{imageId}</Typography.Text></Radio>
          </Col>
          <Col span={24}>
                  <Button type="primary" onClick={()=>{
                    onClick(path)
                  }} icon={<EditOutlined />} size="small">Edit</Button>
          </Col>

        </Row>
      </Col>

    )
  }
}
export default PreviewImageItem
