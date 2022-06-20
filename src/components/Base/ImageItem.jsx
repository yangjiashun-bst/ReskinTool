import React from "react"
import {Checkbox, Col, Image, Row,Typography,Button} from "antd";
import {
  EditOutlined
} from '@ant-design/icons';
import {getUUID} from "@/utils/utils";
class ImageItem extends React.PureComponent{
  render() {
    const {path,onChangeCheckBox,obj,onClick,checked} = this.props;
    const {imageId,sources} = obj

    return(
      <Col span={4} style={{marginTop:5}}>
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
            <Checkbox checked={checked} onChange={e=>{
            onChangeCheckBox(imageId,e.target.checked)
            }}><Typography.Text style={{width:70}} ellipsis={{
            tooltip: `${imageId}`
            }}>{imageId}</Typography.Text></Checkbox>
          </Col>
          {
            sources.map((item,index)=>{
              return(
                <Col span={24} key={getUUID()}>
                  <Button type="primary" onClick={()=>{
                    onClick(imageId,index)
                  }} icon={<EditOutlined />} size="small">{item.width}*{item.height}</Button>
                </Col>
              )
            })
          }
        </Row>


      </Col>

    )
  }
}
export default ImageItem
