import React from 'react';
import {Button, Layout, Row, message, Card, Col, Checkbox} from "antd";
import ImageItem from "@/components/Base/ImageItem";
import {getFilePathById, getUUID, isBackgroundImg} from "@/utils/utils";
import moment from 'moment'
import PreviewRectFormModal from "@/components/Base/PreviewRectFormModal";
import DrawRectFormModal from "@/components/Base/DrawRectFormModal";
import {IS_DEBUG} from "@/utils/globalConst";
import SelectImageItem from "@/components/Base/SelectImageItem";


const { Content, Footer } = Layout;

export default class Index extends React.PureComponent{
  drawRectFormRef = React.createRef()
  selectImageIdList = []
  previewConfig = []
  previewModalRef = React.createRef()
  previewDir = ""

  constructor(props) {
    super(props)

    this.state=({
      btnVisible:true,
      fileDir:"",
      dirFileList:null,
      imageEleList:[],
      selectImageEleList:[],
      imageList:[],
      selectImageId:"",
      selectSourceIndex:0,
      isCheckAll:false,
      isIndeterminate:false

    })
  }
  componentDidMount() {
    message.config({
      top:'30vh'
    })
    window.electronAPI.setTitle("Reskin Tool")
    if(IS_DEBUG) {
      this.setState({
        btnVisible:false
      })
      this.getFileList("D:\\Bluestacks\\cs_reskin")
    }

  }

  handleChangeCheckBox =(imageId,checked)=>{
    const {imageList,dirFileList} = this.state
    console.log("handleChangeCheckBox",imageId);
    if(checked) {
       const selectItem = imageList.filter(item=>item.imageId === imageId);
       selectItem.map(item=>{
         this.selectImageIdList.push(item.imageId)
       })
    } else {
      this.selectImageIdList = this.selectImageIdList.filter(item=>item !== imageId)
    }
    const imageEleList = []

    imageList.map((item)=>{
      const {imageId} = item;
      const path = getFilePathById(dirFileList,imageId)
      let flag = false

      if(path === false) return;
      this.selectImageIdList.every(id=>{
        if(id === imageId) {
          flag = true
          return false
        }
        return true
      })

      imageEleList.push(
        <ImageItem
          key={getUUID()}
          obj={item}
          path={path}
          checked={flag}
          onChangeCheckBox={this.handleChangeCheckBox}
          onClick={this.handleEditClick}/>)
    })

    const selectImageEleList = []
    this.selectImageIdList.map(id=>{
      imageList.every((item)=>{
        const {imageId} = item;
        if(imageId === id) {
          const path = getFilePathById(dirFileList,imageId)
          if(path === false) return
          selectImageEleList.push(
            <SelectImageItem
              key={getUUID()}
              obj={item}
              path={path}
              onDeleteClick={this.handleChangeCheckBox}/>)
            return false
        }
        return true
      })
    })

    if(selectImageEleList.length === imageList.length) {
       this.setState({
         isCheckAll:true,
         isIndeterminate:false
       })
    } else if(selectImageEleList.length !== 0) {
      this.setState({
        isCheckAll:false,
        isIndeterminate:true
      })
    } else {
      this.setState({
        isCheckAll:false,
        isIndeterminate:false
      })
    }
    this.setState({
      selectImageEleList,
      imageEleList
    })
  }
  handleDrawRectModalOK =(selectItem)=>{
    const {imageList,selectImageId,selectSourceIndex} = this.state
    imageList.every((item,index)=>{
      if(item.imageId === selectImageId) {
        const {sources} = item
        sources[selectSourceIndex] = selectItem
        imageList[index].sources = sources
        return false
      }
      return true
    })
    this.setState({
      imageList
    })

  }
  handleEditClick = (imageId,sourceIndex) => {
    const {imageList} = this.state
    imageList.every((item)=>{
       if(item.imageId === imageId) {
         const {sources} = item
         this.setState({
           selectImageId:imageId,
           selectSourceIndex:sourceIndex
         })
         this.drawRectFormRef.current.setState({
           visible:true,
           selectItem:sources[sourceIndex],
         })

         return false
       }
       return true
    })

  }
  handleEditPreviewClick = async ()=> {
    if(this.selectImageIdList.length === 0) {
      message.warn("Please select images!")
      return
    }
    const {imageList} = this.state
    const selectResImageList = []
    this.selectImageIdList.map(item=>{
      imageList.every(image=>{
        if(image.imageId === item) {
          selectResImageList.push(image)
          return false
        }
        return true
      })
    })
    if(!this.previewDir) {
      const fileDir = await window.electronAPI.browseDir()
      if(fileDir === false)
        return
      this.previewDir = fileDir
    }
    const fileList = await window.electronAPI.readDir(this.previewDir)

    this.previewModalRef.current.setState({
      visible:true,
      selectResImageList,
      fileList
    })
  }

  handleBrowseDirClick = async ()=> {
    const fileDir = await window.electronAPI.browseDir()

    if(fileDir === false)
      return

    const flag = await this.getFileList(fileDir)
    if(flag) {
      this.setState({
        fileDir,
        btnVisible:false
      })
    }
  }

  handleSaveFile =()=>{
    if(this.selectImageIdList.length === 0) {
      message.warn("Please selected image!")
      return
    }
    const {imageList,fileDir} = this.state
    const resultImageList = []

    this.selectImageIdList.map(item=>{
      imageList.every(image=>{
          if(image.imageId === item){
              resultImageList.push(image)
              return false
          }
          return true
        })
    })

    for(let i=0;i<resultImageList.length;i++) {
      let item = resultImageList[i]
      let maxW=0
      let maxH=0
      item['glbUrl'] = ""
      const {imageId,sources,pixelSize} = item
      sources.map(source=>{
        if(source.w>maxW) {
          maxW = source.w
        }
        if(source.h>maxH) {
          maxH = source.h
        }
      })


      if(IS_DEBUG) {
        let previewUrl = ""
        if(this.previewConfig.hasOwnProperty(imageId)) {
            previewUrl = this.previewConfig[imageId].previewUrl;
        }
        if(isBackgroundImg(item.imageId)) {
          item = {...item,previewUrl,...{"previewConfig":{"srcHeight":maxH,"srcWidth":maxW,"position":[{"x":0,"y":0,"w":512,"h":512}]}}}
        } else {
          const str = "[{\"x\":825,\"y\":52,\"w\":183,\"h\":185},{\"x\":244,\"y\":244,\"w\":183,\"h\":185},{\"x\":825,\"y\":244,\"w\":183,\"h\":185},{\"x\":1021,\"y\":244,\"w\":183,\"h\":185},{\"x\":50,\"y\":431,\"w\":183,\"h\":185},{\"x\":245,\"y\":431,\"w\":183,\"h\":185},{\"x\":440,\"y\":431,\"w\":183,\"h\":185},{\"x\":440,\"y\":622,\"w\":183,\"h\":185},{\"x\":1216,\"y\":622,\"w\":183,\"h\":185},{\"x\":1021,\"y\":812,\"w\":183,\"h\":185},{\"x\":50,\"y\":1002,\"w\":183,\"h\":185},{\"x\":245,\"y\":1002,\"w\":183,\"h\":185},{\"x\":1216,\"y\":1002,\"w\":183,\"h\":185}]"
          item = {...item,previewUrl,...{"previewConfig":{"srcHeight":maxH,"srcWidth":maxW,"position":JSON.parse(str)}}}
        }
      } else {
        let previewConfig;
        if(this.previewConfig.hasOwnProperty(imageId)) {
          previewConfig = {...this.previewConfig[imageId],...{"previewConfig":{"srcHeight":maxH,"srcWidth":maxW}}}
        } else {
          previewConfig = {"previewConfig":{"srcHeight":maxH,"srcWidth":maxW}}
        }

        item = {...item, ...previewConfig}
      }


      resultImageList[i] = item;
    }

    const path = fileDir;//+"\\"+moment().format("YYYY-MM-DD_HH_mm_ss")+".cfg"
    const updateTimestamp = moment().valueOf()
    window.electronAPI.createZip(path,JSON.stringify({"images":resultImageList,"metaData":{"ParserVersion":0,"UpdateTimestamp":updateTimestamp}}))
    message.success("Save config file finish!")
  }
  handlePreviewOnOk =(imageId,previewUrl,areaList)=> {

    this.previewConfig[imageId] = {
        previewUrl,
       "previewConfig":{
         "position":areaList
       }
      }
  }
  getFileList = async (fileDir)=>{

    const content = await window.electronAPI.readFile(fileDir+"\\texturemap.cfg");
   // console.log("content",content)
    if(content === false) {
      message.warn("texturemap.cfg file not exist!")
      return false;
    }
    const texturemapObj = JSON.parse(content)

    const dirFileList = await window.electronAPI.readDir(fileDir)

    const {images} = texturemapObj
    const imageEleList = []

    images.map((item)=>{
        const {imageId} = item;
        const path = getFilePathById(dirFileList,imageId)
        if(path === false) return;
        imageEleList.push(
          <ImageItem
                key={getUUID()}
                obj={item}
                path={path}
                checked={false}
                onChangeCheckBox={this.handleChangeCheckBox}
                onClick={this.handleEditClick}/>)
    })
    this.setState({
      imageEleList,
      imageList:images,
      dirFileList,
      fileDir
    })
    return true
  }

  handleCheckAllClick =(checked)=> {

    const {imageList,dirFileList} = this.state
    const imageEleList = []
    const selectImageEleList = []
    this.selectImageIdList = []
    imageList.map((item)=>{
      const {imageId} = item;
      const path = getFilePathById(dirFileList,imageId)
      if(path === false) return;

      imageEleList.push(
        <ImageItem
          key={getUUID()}
          obj={item}
          path={path}
          checked={checked}
          onChangeCheckBox={this.handleChangeCheckBox}
          onClick={this.handleEditClick}/>)

      if(checked) {
        this.selectImageIdList.push(imageId)
        selectImageEleList.push(
          <SelectImageItem
            key={getUUID()}
            obj={item}
            path={path}
            onDeleteClick={this.handleChangeCheckBox}/>)
      }
    })
    if(checked) {
      this.setState({
        selectImageEleList,
        imageEleList,
        isCheckAll:true,
        isIndeterminate:false
      })
    } else {
      this.setState({
        isCheckAll:false,
        isIndeterminate:false,
        selectImageEleList,
        imageEleList
      })
    }

  }
  render() {
    const {btnVisible,
      imageEleList,
      dirFileList,
      selectImageEleList,
      isIndeterminate,
      isCheckAll} = this.state
    return (
      <div>
        {btnVisible?(<div style={{marginTop:50,marginLeft:50}}>
          <p>Please click and open source first</p>
          <Button type="primary" onClick={this.handleBrowseDirClick} >Open Source</Button>
        </div>):(
          <Layout>
          <Content>
            <Row style={{marginTop:30,marginLeft:30,marginBottom:90,overflow:"hidden"}}>
              <Col span={18}>
                <Card
                  title={"Resource Image"}
                  extra={<Checkbox indeterminate={isIndeterminate} checked={isCheckAll} onChange={e=>{
                      this.handleCheckAllClick(e.target.checked)
                  }}>Check All</Checkbox>}>
                  <Row>
                    {imageEleList}
                  </Row>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  title={"Select Resource Image"}
                  extra={`Num:${selectImageEleList.length}`}>
                  <Row>
                    {selectImageEleList}
                  </Row>
                </Card>
              </Col>
            </Row>

          </Content>
          <Footer style={{
            position:"fixed",
            zIndex:1,
            width: "100%",
            bottom:1
          }}>
            <Button type={"primary"} shape={"round"} onClick={this.handleEditPreviewClick}>Edit Preview</Button>
            <Button type={"primary"} shape={"round"} style={{marginLeft:50}} onClick={this.handleSaveFile}>Save File</Button>
          </Footer>
        </Layout>)}
        <DrawRectFormModal
            ref={this.drawRectFormRef}
            onOk={this.handleDrawRectModalOK}
            dirFileList={dirFileList}/>
        <PreviewRectFormModal
          ref={this.previewModalRef}
          onOk={this.handlePreviewOnOk}
          selectImageIdList={this.selectImageIdList}

          dirFileList={dirFileList}
        />
      </div>

    )
  }
}
