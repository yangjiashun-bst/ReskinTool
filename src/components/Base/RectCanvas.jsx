import React from 'react'
import {Stage, Layer, Image, Rect} from 'react-konva';
import {message} from "antd";
import {getUUID, transCanvasAreaToImage, transImageAreaToCanvas} from "@/utils/utils";
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "@/utils/globalConst";


class URLImage extends React.Component {
  state = {
    image: null,
  };

  componentDidMount() {
    this.loadImage();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }

  componentWillUnmount() {
    this.image.removeEventListener('load', this.handleLoad);
  }

  loadImage() {
    this.image = new window.Image();
    this.image.src = this.props.src;
    this.image.addEventListener('load', this.handleLoad);
  }

  handleLoad = () => {

    this.setState({
      image: this.image,
    });

  };

  render() {
    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}

        image={this.state.image}
        ref={(node) => {
          this.imageNode = node;
        }}
      />
    );
  }
}

class RectCanvas extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = ({
      imageInfo: null,
      rectPosition: null,
      isDownFlag: false,
      startPoint: null,
    })
  }

  async componentDidMount() {

    await this.getImageInfo()

  }

  getImageInfo = async () => {
    const {path} = this.props
    const imageInfo = await window.electronAPI.readImageInfo(path);
    if (imageInfo === false) {
      message.error("image file not exist")
    } else {
      this.setState({
        imageInfo
      })
    }
  }
  handleMouseDown = (e) => {

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    //console.log("handleMouseDown...",point)

    this.setState({
      isDownFlag: true,
      startPoint: {x: parseInt(point.x), y: parseInt(point.y)}
    })
  }

  handleMouseMove = (e) => {
    const {isDownFlag, startPoint, imageInfo} = this.state
    if (!isDownFlag) return
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    const imageArea = transCanvasAreaToImage({
        ...startPoint,
        w: parseInt(point.x - startPoint.x),
        h: parseInt(point.y - startPoint.y)
      },
      {"width": CANVAS_WIDTH, "height": CANVAS_HEIGHT}, imageInfo)
    const {handlePositionChange} = this.props
    handlePositionChange(imageArea)

  }
  handleMouseUp = (e) => {
    this.setState({
      isDownFlag: false,
    })

  }

  render() {
    const {path, position, areaList} = this.props
    const {imageInfo} = this.state

    if (!imageInfo) {
      return "";
    }
    if (position) {
      const canvasArea = transImageAreaToCanvas(position, imageInfo, {"width": CANVAS_WIDTH, "height": CANVAS_HEIGHT})

      return (
        <div style={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "gray"
        }}>
          <Stage
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}>
            <Layer>
              <URLImage src={"file:///" + path}/>
              <Rect
                {...canvasArea}
                stroke="red"
                strokeWidth={3}/>
              {
                areaList && areaList.map(item => {
                  const newArea = transImageAreaToCanvas(item, imageInfo, {
                    "width": CANVAS_WIDTH,
                    "height": CANVAS_HEIGHT
                  })
                  return (<Rect
                    key={getUUID()}
                    {...newArea}
                    stroke="red"
                    strokeWidth={3}
                  />)
                })
              }
            </Layer>
          </Stage>
        </div>
      )
    }
    return (
      <div style={{
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "gray"
      }}>
        <Stage
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}

          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}>
          <Layer>
            <URLImage src={"file:///" + path}/>
            {
              areaList && areaList.map(item => {
                const newArea = transImageAreaToCanvas(item, imageInfo, {"width": CANVAS_WIDTH, "height": CANVAS_HEIGHT})
                return (<Rect
                  key={getUUID()}
                  {...newArea}
                  stroke="red"
                  strokeWidth={3}
                />)
              })
            }
          </Layer>

        </Stage>
      </div>

    )
  }
}

export default RectCanvas
