import React from "react"
import {Col, Image, Row,Typography,Button} from "antd";
import {
  DeleteOutlined
} from '@ant-design/icons';
import {getUUID} from "@/utils/utils";
class SelectImageItem extends React.PureComponent{
  render() {
    const {path,onDeleteClick,obj} = this.props;
    const {imageId} = obj

    return(
      <Col span={12} style={{marginTop:5}}>
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
             <Typography.Text style={{width:70}} ellipsis={{
            tooltip: `${imageId}`
            }}>{imageId}</Typography.Text>
          </Col>

                <Col span={24} key={getUUID()}>
                  <Button type="primary" onClick={()=>{
                    onDeleteClick(imageId,false)
                  }} icon={<DeleteOutlined />} size="small">Delete</Button>
                </Col>

        </Row>


      </Col>

    )
  }
}
export default SelectImageItem
