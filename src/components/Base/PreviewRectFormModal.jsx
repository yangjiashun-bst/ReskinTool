import React from 'react'
import {Row, Col, Radio, Modal, message, Layout, Button, Card, Checkbox} from 'antd'
import PreviewImageItem from "@/components/Base/PreviewImageItem";
import {getFileNameAndSuffix, getFilePathById, getUUID} from "@/utils/utils";
import PreviewResImageItem from "@/components/Base/PreviewResImageItem";
import PreviewDrawRectModal from "@/components/Base/PreviewDrawRectModal";
import {MODAL_CONTENT_HEIGHT, MODAL_WIDTH} from "@/utils/globalConst";


class PreviewRectFormModal extends React.PureComponent{

  selectPreviewImageId = ""
  modalRef = React.createRef()
  imageAreaList = {}


  constructor(props) {
    super(props);
    this.state = ({
      fileList: [],
      selectResImageList: [],
      visible:false,
      checkedImageList:[],
      isCheckAll:false,
      isIndeterminate:false,
    })
  }


  handleCheckboxChange =(imageId,checked)=> {

    let {selectResImageList,checkedImageList} = this.state
    if(checked) {
      const selectItem = selectResImageList.filter(item=>item.imageId === imageId);
      checkedImageList = checkedImageList.concat(selectItem)
    } else {
        checkedImageList = checkedImageList.filter(item=>item.imageId !== imageId)
    }
    if(checkedImageList.length === selectResImageList.length) {
      this.setState({
        isCheckAll:true,
        isIndeterminate:false
      })
    } else if(checkedImageList.length>0){
      this.setState({
        isIndeterminate:true,
        isCheckAll:false,
      })
    } else {
      this.setState({
        isIndeterminate:false,
        isCheckAll:false
      })
    }
    this.setState({
      checkedImageList
    })
  }
  handleOnChangeRadio =(imageId)=> {
      console.log({"imageId":imageId});
      this.selectPreviewImageId = imageId
  }
  handleOnClick=(path)=>{
    const imageId = getFileNameAndSuffix(path)
    if(this.imageAreaList.hasOwnProperty(imageId)) {
      this.modalRef.current.setState({
        visible:true,
        path,
        areaList:this.imageAreaList[imageId]
      })
    } else {
      this.modalRef.current.setState({
        visible:true,
        path,
        areaList: []
      })
    }
  }
  handlePreviewModalOk =(imageId,area)=> {
    this.imageAreaList[imageId] = area
  }

  handleOnOk =()=> {
    const {onOk} = this.props
    const {checkedImageList} = this.state
    if(!this.selectPreviewImageId) {
      message.warn("Please select preview image!")
      return
    }

    if(!this.imageAreaList.hasOwnProperty(this.selectPreviewImageId)){
       checkedImageList.map(item=>{
        onOk(item.imageId,this.selectPreviewImageId,[])
      })
      message.success("Save finish!")
      return
    }
    checkedImageList.map(item=>{
      onOk(item.imageId,this.selectPreviewImageId,this.imageAreaList[this.selectPreviewImageId])
    })
    message.success("Save finish!")

  }

  clear =()=> {
    this.selectPreviewImageId = ""
    this.imageAreaList = {}
    this.setState({
      checkedImageList:[],
      isCheckAll:false,
      isIndeterminate:false
    })
  }

  handleCheckAllClick =(checked)=> {
    let {selectResImageList,checkedImageList} = this.state
    if(checked) {
      checkedImageList = selectResImageList
    } else {
      checkedImageList = []
    }
    this.setState({
      checkedImageList,
      isCheckAll:checked,
      isIndeterminate:false
    })
  }
  render() {
    const {fileList,selectResImageList,visible,checkedImageList,isIndeterminate,isCheckAll} = this.state

    const {dirFileList} = this.props
    return (
      <div>
        {
          visible?(
            <Modal
              title={"Preview Edit"}
              visible={visible}
              maskClosable={false}
              width={MODAL_WIDTH}
              style={{
                top:1
              }}
              footer={null}
              onCancel={()=>{
                this.setState({
                  visible:false
                })
                this.clear()
              }}>
              <Row style={{height:MODAL_CONTENT_HEIGHT,overflowX:"hidden",overflowY:"scroll"}}>
                    <Col span={8} style={{paddingLeft:30}}>
                      <Card
                        title="Preview Images">
                        <Radio.Group onChange={e=>{
                          this.handleOnChangeRadio(e.target.value)
                        }}>
                          <Row>
                            {fileList.map(item=>{
                              return (
                                <PreviewImageItem key={getUUID()} path={item}  onClick={this.handleOnClick}/>
                              )
                            })}
                          </Row>
                        </Radio.Group>
                      </Card>
                    </Col>
                    <Col span={16}>
                      <Card
                        title={checkedImageList.length>0?`Resource Images (Num:${checkedImageList.length})`:"Resource Images"}
                        extra={
                        <Row>
                          <Col span={24}>
                            <Checkbox indeterminate={isIndeterminate} checked={isCheckAll} onChange={e=>{
                            this.handleCheckAllClick(e.target.checked)
                          }}>Check All</Checkbox>
                          </Col>
                        </Row>
                        }>
                        <Row gutter={[5,5]}>
                          {selectResImageList.map(item=>{
                            let checked = false
                            checkedImageList.every(image=>{
                              if(image.imageId === item.imageId) {
                                  checked = true
                                  return false
                              }
                              return true
                            })

                            return(
                              <PreviewResImageItem
                                key={getUUID()}
                                onCheckboxChange={this.handleCheckboxChange}
                                path={getFilePathById(dirFileList,item.imageId)}
                                checked={checked}/>
                            )
                          })}
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                  <PreviewDrawRectModal ref={this.modalRef} onOk={this.handlePreviewModalOk} />
                  <Button type="primary" shape="round" style={{marginLeft:50,marginTop:10}} onClick={this.handleOnOk}>Save</Button>
            </Modal>
          ):""
        }

      </div>

    )
  }
}

export default PreviewRectFormModal
