import React from 'react';
import {Button, Layout, Row, message, Card, Col, Checkbox} from "antd";
import ImageItem from "@/components/Base/ImageItem";
import {getFilePathById, getUUID} from "@/utils/utils";
import moment from 'moment'
import PreviewRectFormModal from "@/components/Base/PreviewRectFormModal";
import DrawRectFormModal from "@/components/Base/DrawRectFormModal";
import SelectImageItem from "@/components/Base/SelectImageItem";
import BaseFormModal from "@/components/Base/BaseFormModal";
import InputModal from "@/components/Base/InputModal";


const {Content, Footer} = Layout;

export default class Index extends React.PureComponent {
  drawRectFormRef = React.createRef()
  selectImageIdList = []
  previewConfig = []
  GLBConfig = []
  coverUrlConfig = []

  previewModalRef = React.createRef()
  GLBModalRef = React.createRef()
  coverModalRef = React.createRef()
  inputModalRef = React.createRef()

  previewDir = ""
  GLBDir = ""
  CoverDir = ""

  constructor(props) {
    super(props)

    this.state = ({
      btnVisible: true,
      fileDir: "",
      dirFileList: null,
      imageEleList: [],
      selectImageEleList: [],
      imageList: [],
      selectImageId: "",
      selectSourceIndex: 0,
      isCheckAll: false,
      isIndeterminate: false

    })
  }

  componentDidMount() {
    message.config({
      top: '30vh'
    })
    window.electronAPI.setTitle("Reskin Tool")
    // if (isDev()) {
    //   this.setState({
    //     btnVisible: false
    //   })
    //   this.getFileList("D:\\Bluestacks\\cs_reskin")
    // }

  }

  handleChangeCheckBox = (imageId, checked) => {
    const {imageList, dirFileList} = this.state
    if (checked) {
      const selectItem = imageList.filter(item => item.imageId === imageId);
      selectItem.map(item => {
        this.selectImageIdList.push(item.imageId)
      })
    } else {
      this.selectImageIdList = this.selectImageIdList.filter(item => item !== imageId)
    }
    const imageEleList = []

    imageList.map((item) => {
      const {imageId} = item;
      const path = getFilePathById(dirFileList, imageId)
      let flag = false

      if (path === false) return;
      this.selectImageIdList.every(id => {
        if (id === imageId) {
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
    this.selectImageIdList.map(id => {
      imageList.every((item) => {
        const {imageId} = item;
        if (imageId === id) {
          const path = getFilePathById(dirFileList, imageId)
          if (path === false) return
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

    if (selectImageEleList.length === imageList.length) {
      this.setState({
        isCheckAll: true,
        isIndeterminate: false
      })
    } else if (selectImageEleList.length !== 0) {
      this.setState({
        isCheckAll: false,
        isIndeterminate: true
      })
    } else {
      this.setState({
        isCheckAll: false,
        isIndeterminate: false
      })
    }
    this.setState({
      selectImageEleList,
      imageEleList
    })
  }
  handleDrawRectModalOK = (selectItem) => {
    const {imageList, selectImageId, selectSourceIndex} = this.state
    imageList.every((item, index) => {
      if (item.imageId === selectImageId) {
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
  handleEditClick = (imageId, sourceIndex) => {
    const {imageList} = this.state
    imageList.every((item) => {
      if (item.imageId === imageId) {
        const {sources} = item
        this.setState({
          selectImageId: imageId,
          selectSourceIndex: sourceIndex
        })
        this.drawRectFormRef.current.setState({
          visible: true,
          selectItem: sources[sourceIndex],
        })

        return false
      }
      return true
    })

  }
  handleEditPreviewClick = async () => {
    const selectResImageList = this.getSelectedImages();
    if (!selectResImageList || selectResImageList.length === 0) {
      return;
    }

    if (!this.previewDir) {
      const fileDir = await window.electronAPI.browseDir()
      if (fileDir === false)
        return
      this.previewDir = fileDir
    }
    const fileList = await window.electronAPI.readDir(this.previewDir)

    this.previewModalRef.current.setState({
      visible: true,
      selectResImageList,
      fileList
    })
  }
  getSelectedImages = () => {
    if (this.selectImageIdList.length === 0) {
      message.warn("Please select images!")
      return null;
    }
    const {imageList} = this.state
    const selectResImageList = []
    this.selectImageIdList.map(item => {
      imageList.every(image => {
        if (image.imageId === item) {
          selectResImageList.push(image)
          return false
        }
        return true
      })
    })
    return selectResImageList;
  }
  handleEditGLBClick = async () => {
    const selectResImageList = this.getSelectedImages();
    if (!selectResImageList || selectResImageList.length === 0) {
      return;
    }
    if (!this.GLBDir) {
      const fileDir = await window.electronAPI.browseDir()
      if (fileDir === false)
        return
      this.GLBDir = fileDir
    }
    const fileList = await window.electronAPI.readDir(this.GLBDir)
    this.GLBModalRef.current.setState({
      visible: true,
      selectResImageList,
      fileList
    })
  }
  handleEditCoverClick = async () => {
    const selectResImageList = this.getSelectedImages();
    if (!selectResImageList || selectResImageList.length === 0) {
      return;
    }
    if (!this.CoverDir) {
      const fileDir = await window.electronAPI.browseDir()
      if (fileDir === false)
        return
      this.CoverDir = fileDir
    }
    const fileList = await window.electronAPI.readDir(this.CoverDir)
    this.coverModalRef.current.setState({
      visible: true,
      selectResImageList,
      fileList
    })
  }
  handleSetCategoryClick = async () => {
    const selectResImageList = this.getSelectedImages();
    if (!selectResImageList || selectResImageList.length === 0) {
      return;
    }

    this.inputModalRef.current.setState({
      visible: true,
    })
  }

  handleBrowseDirClick = async () => {
    const fileDir = await window.electronAPI.browseDir()

    if (fileDir === false)
      return

    const flag = await this.getFileList(fileDir)
    if (flag) {
      this.setState({
        fileDir,
        btnVisible: false
      })
    }
  }

  handleSaveFile = () => {
    if (this.selectImageIdList.length === 0) {
      message.warn("Please selected image!")
      return
    }
    const {imageList, fileDir} = this.state
    const resultImageList = []

    this.selectImageIdList.map(item => {
      imageList.every(image => {
        if (image.imageId === item) {
          resultImageList.push(image)
          return false
        }
        return true
      })
    })

    for (let i = 0; i < resultImageList.length; i++) {
      let item = resultImageList[i]
      const {imageId, sources} = item
      let maxW = 0
      let maxH = 0
      item['glbUrl'] = ""
      if (this.GLBConfig.hasOwnProperty(imageId)) {
        item['glbUrl'] = this.GLBConfig[imageId]
      }
      if (this.coverUrlConfig.hasOwnProperty(imageId)) {
        item['coverUrl'] = this.coverUrlConfig[imageId]
      }
      sources.map(source => {
        if (source.w > maxW) {
          maxW = source.w
        }
        if (source.h > maxH) {
          maxH = source.h
        }
      })


      let previewConfig;
      if (this.previewConfig.hasOwnProperty(imageId)) {
        previewConfig = this.previewConfig[imageId];
        previewConfig = {
          ...previewConfig,
          "previewConfig": {"srcHeight": maxH, "srcWidth": maxW, "position": [...previewConfig.previewConfig.position]}
        }
      } else {
        previewConfig = {"previewConfig": {"srcHeight": maxH, "srcWidth": maxW}}
      }
      item = {...item, ...previewConfig}
      resultImageList[i] = item;
    }
    const path = fileDir;
    const updateTimestamp = moment().valueOf()
    window.electronAPI.createZip(path, JSON.stringify({
      "images": resultImageList,
      "metaData": {"ParserVersion": 0, "UpdateTimestamp": updateTimestamp}
    }))
    message.success("Save config file in " + path + "\\reskin_res")
  }
  handlePreviewOnOk = (imageId, previewUrl, areaList) => {

    this.previewConfig[imageId] = {
      previewUrl,
      "previewConfig": {
        "position": areaList
      }
    }
  }

  handleGLBOnOk = (imageId, url) => {
    this.GLBConfig[imageId] = url
  }
  handleCoverOnOk = (imageId, url) => {
    this.coverUrlConfig[imageId] = url
  }
  handleSetCategoryOnOk = (category) => {
    const {imageList} = this.state
    const selectResImageList = this.getSelectedImages();
    if (!selectResImageList || selectResImageList.length === 0) {
      return;
    }
    selectResImageList.map(image => {
      const {imageId} = image
      imageList.every((item, index) => {
        if (item.imageId === imageId) {
          imageList[index].category = category
          return false
        }
        return true
      })
    })

  }
  getFileList = async (fileDir) => {

    const content = await window.electronAPI.readFile(fileDir + "\\texturemap.cfg");
    if (content === false) {
      message.warn("texturemap.cfg file not exist!")
      return false;
    }
    const texturemapObj = JSON.parse(content)

    const dirFileList = await window.electronAPI.readDir(fileDir)

    const {images} = texturemapObj
    const imageEleList = []

    images.map((item) => {
      const {imageId} = item;
      const path = getFilePathById(dirFileList, imageId)
      if (path === false) return;
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
      imageList: images,
      dirFileList,
      fileDir
    })
    return true
  }

  handleCheckAllClick = (checked) => {

    const {imageList, dirFileList} = this.state
    const imageEleList = []
    const selectImageEleList = []
    this.selectImageIdList = []
    imageList.map((item) => {
      const {imageId} = item;
      const path = getFilePathById(dirFileList, imageId)
      if (path === false) return;

      imageEleList.push(
        <ImageItem
          key={getUUID()}
          obj={item}
          path={path}
          checked={checked}
          onChangeCheckBox={this.handleChangeCheckBox}
          onClick={this.handleEditClick}/>)

      if (checked) {
        this.selectImageIdList.push(imageId)
        selectImageEleList.push(
          <SelectImageItem
            key={getUUID()}
            obj={item}
            path={path}
            onDeleteClick={this.handleChangeCheckBox}/>)
      }
    })
    if (checked) {
      this.setState({
        selectImageEleList,
        imageEleList,
        isCheckAll: true,
        isIndeterminate: false
      })
    } else {
      this.setState({
        isCheckAll: false,
        isIndeterminate: false,
        selectImageEleList,
        imageEleList
      })
    }

  }

  render() {
    const {
      btnVisible,
      imageEleList,
      dirFileList,
      selectImageEleList,
      isIndeterminate,
      isCheckAll
    } = this.state
    return (
      <div>
        {btnVisible ? (<div style={{marginTop: 50, marginLeft: 50}}>
          <p>Please click and open source first</p>
          <Button type="primary" onClick={this.handleBrowseDirClick}>Open Source</Button>
        </div>) : (
          <Layout>
            <Content>
              <Row style={{marginTop: 30, marginLeft: 30, marginBottom: 90, overflow: "hidden"}}>
                <Col span={18}>
                  <Card
                    title={"Resource Image"}
                    extra={<Checkbox indeterminate={isIndeterminate} checked={isCheckAll} onChange={e => {
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
              position: "fixed",
              zIndex: 1,
              width: "100%",
              bottom: 1
            }}>
              <Button type={"primary"} shape={"round"} onClick={this.handleEditPreviewClick}>Edit Preview</Button>
              <Button type={"primary"} shape={"round"} style={{marginLeft: 50}} onClick={this.handleEditGLBClick}>Edit
                GLB</Button>
              <Button type={"primary"} shape={"round"} style={{marginLeft: 50}} onClick={this.handleEditCoverClick}>Edit
                Cover</Button>
              <Button type={"primary"} shape={"round"} style={{marginLeft: 50}} onClick={this.handleSetCategoryClick}>Set
                Category</Button>
              <Button type={"primary"} shape={"round"} style={{marginLeft: 50}} onClick={this.handleSaveFile}>Save
                File</Button>

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
        <BaseFormModal
          ref={this.GLBModalRef}
          onOk={this.handleGLBOnOk}
          selectImageIdList={this.selectImageIdList}
          dirFileList={dirFileList}
          isGLB={true}
          type={"GLB"}
          isNotEdit={true}
        />
        <BaseFormModal
          ref={this.coverModalRef}
          onOk={this.handleCoverOnOk}
          selectImageIdList={this.selectImageIdList}
          dirFileList={dirFileList}
          type={"Cover"}
          isNotEdit={true}
        />
        <InputModal
          ref={this.inputModalRef}
          title={"Set Category"}
          onOk={this.handleSetCategoryOnOk}
          placeholder={"Input Category"}
        />
      </div>

    )
  }
}
