import React from "react"
import {Checkbox, Col, Image, Row, Typography, Button, Radio} from "antd";
import {
  EditOutlined
} from '@ant-design/icons';
import {getFileName, getFileNameAndSuffix, getUUID} from "@/utils/utils";
class PreviewResImageItem extends React.PureComponent{
  render() {
    const {path,onCheckboxChange,checked} = this.props
    const imageId = getFileName(path)
    return(
      <Col span={4} style={{marginTop:5}}>
        <Row gutter={[15,15]}>
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
            <Checkbox
              checked={checked}
              onChange={(e)=>{
              onCheckboxChange(imageId,e.target.checked)
            }}><Typography.Text style={{width:70}} ellipsis={{
            tooltip: `${imageId}`
            }}>{imageId}</Typography.Text></Checkbox>
          </Col>

        </Row>
      </Col>

    )
  }
}
export default PreviewResImageItem
