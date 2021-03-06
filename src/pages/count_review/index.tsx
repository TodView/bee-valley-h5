import Taro, {
  Component
} from '@tarojs/taro'
import {
  View,
  Button,
  Image,
  Input
} from '@tarojs/components'
import * as d3 from 'd3'
import NavBar from '../../components/navBar/index'
import {
  fetchReview,
  downloadReviewFile,
  submitReview,
  cancelWork,
  checkDveice
} from '../../utils/beevalley'
import './index.scss'
import i18next from '../../i18n'

export default class PointReview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentWork: {},
      lineData: [],
      lineWidth: 50
    }

    this.apiToken = Taro.getStorageSync('apiToken');
  }

  fetchWorks = () => {
    let {
      apiToken
    } = this;
    fetchReview(apiToken, 'count', 4, this.packageId).then((res) => {
      this.work = res;

      if (this.work.length > 0) {
        this.getImgFile(this.work[this.work.length - 1].id)
        this.nextWork()
      } else {
        Taro.showToast({
          title: i18next.t('notask')
        })
      }
    }).catch(this.defaultErrorHandling)
  }

  nextWork = () => {
    if (this.work.length > 0) {
      let nowWork = this.work.pop();
      if (this.work.length > 0) {
        this.getImgFile(this.work[this.work.length - 1].id)
      }
      this.setState({
        currentWork: nowWork
      })
      // Taro.hideLoading()
    } else {
      this.setState({
        currentWork: {}
      })
      this.fetchWorks();
    }
  }

  getImgFile = (imgId) => {
    let {
      apiToken
    } = this;
    downloadReviewFile(apiToken, imgId).then((res) => {
      let imgBase64 = 'data:image/jpeg;base64,' + Taro.arrayBufferToBase64(new Uint8Array(res));
      if (imgId === this.state.currentWork.id) {
        let current = Object.assign({}, this.state.currentWork, {
          src: imgBase64
        });

        this.setState({
          currentWork: current
        })
      } else {
        let foundIndex = this.work.findIndex(item => item.id === imgId);

        if (foundIndex >= 0) {
          this.work[foundIndex].src = imgBase64;
        }
      }
    }).catch(this.defaultErrorHandling);

  }

  submitWork = () => {
    let {
      currentWork
    } = this.state;
    if (!currentWork.id) return;
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
    this.setState({
      currentWork: {}
    })
    submitReview(this.apiToken, currentWork.id, true)
      .then(() => this.nextWork())
      .catch(this.defaultErrorHandling)
  }

  rejectWork = () => {

    let {
      currentWork
    } = this.state;
    if (!currentWork.id) return;
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
    this.setState({
      currentWork: {}
    })
    submitReview(this.apiToken, currentWork.id, false)
      .then(() => this.nextWork())
      .catch(this.defaultErrorHandling)
  }

  cancelWork = () => {

    let {
      currentWork
    } = this.state;
    if (!currentWork.id) return;
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
    this.setState({
      currentWork: {}
    })
    cancelWork(this.apiToken, [currentWork.id])
      .then(() => this.nextWork())
      .catch(this.defaultErrorHandling)
  }

  imgLoad = () => {

  }

  componentDidMount() {
    this.packageId = this.$router.params.packageId;
    let res = Taro.getSystemInfoSync()
    this.screenWidth = res.windowWidth;
    this.isMobile = checkDveice(res)

    this.svg = d3.select(".workImg").append("svg");

    this.svg.on("mouseover", () => {
      this.changeLine(d3.event.offsetX, d3.event.offsetY)

      this.svg.on("mousemove", () => {
        this.changeLine(d3.event.offsetX, d3.event.offsetY)
      })

      this.svg.on("mouseout", () => {
        this.svg.on("mousemove", null);
        this.svg.on("mouseout", null);
        this.setState({
          lineData: []
        })
      })
    })

    if (process.env.TARO_ENV === 'weapp') {} else if (process.env.TARO_ENV === 'h5') {}

    Taro.showLoading({
      title: 'loading',
      mask: true
    })

    this.fetchWorks()
  }

  componentWillUnmount() {
    if (this.work) {
      let toCancel = this.work.map(w => w.id)
      if (this.state.currentWork && this.state.currentWork.id) {
        toCancel.push(this.state.currentWork.id)
      }
      if (toCancel.length > 0) {
        cancelWork(this.apiToken, toCancel)
      }
    }
  }

  updateCircle = () => {

    let {
      currentWork
    } = this.state;
    if (currentWork.work) {
      let circle = this.svg.selectAll("circle");
      let update = circle.data(currentWork.work.result);
      update.exit().remove();
      update.enter().append("circle")
        .attr("r", 10)
        .attr("fill", "red")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
      update.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    }
  }

  updateLine = (lineData) => {
    if (this.svg) {
      let line = this.svg.selectAll("line");
      let update = line.data(lineData);

      update.exit().remove();

      update.enter().append("line")
        .attr("x1", (d) => d.x1)
        .attr("y1", (d) => d.y1)
        .attr("x2", (d) => d.x2)
        .attr("y2", (d) => d.y2)
        .style("stroke", "red")
        .style("stroke-width", 2);

      update.attr("x1", (d) => d.x1)
        .attr("y1", (d) => d.y1)
        .attr("x2", (d) => d.x2)
        .attr("y2", (d) => d.y2);
    }
  }

  changeLine = (eventX, eventY) => {
    let {
      lineWidth
    } = this.state;
    let pointRadius = 10;
    let hengX1 = eventX - pointRadius;
    let hengX2 = eventX + pointRadius;

    let shuY1 = eventY - pointRadius;
    let shuY2 = eventY + pointRadius;

    this.setState({
      lineData: [{
        x1: hengX1,
        x2: eventX - lineWidth,
        y1: eventY,
        y2: eventY
      }, {
        x1: hengX2,
        x2: eventX + lineWidth,
        y1: eventY,
        y2: eventY
      }, {
        x1: eventX,
        x2: eventX,
        y1: shuY1,
        y2: eventY - lineWidth
      }, {
        x1: eventX,
        x2: eventX,
        y1: shuY2,
        y2: eventY + lineWidth
      }]
    });
  }

  changeR = (ev) => {
    this.setState({
      lineWidth: parseFloat(ev.target.value)
    });
  }

  defaultErrorHandling = (error) => {
    Taro.hideLoading()
    if (error === 'forbidden') {
      Taro.navigateBack({
        delta: 1
      })
    } else {
      Taro.showToast({
        title: error,
        mask: true
      })
    }
  }

  render() {

    let {
      currentWork,
      lineData
    } = this.state;

    if (currentWork && currentWork.src) {
      Taro.hideLoading()
    }

    if (currentWork.src && this.svg) {

      this.svg
        .attr("width", this.state.currentWork.meta.imageWidth)
        .attr("height", this.state.currentWork.meta.imageHeight);
      this.updateCircle();
      this.updateLine(lineData);
    }

    return (
      <View className='count_review'>
        <NavBar title={i18next.t('TargetLocationAudit')} />
                <View className='imgItem'>
                    {currentWork.src && (
                        <Image src={currentWork.src} style={`width:${currentWork.meta.imageWidth}px;height:${currentWork.meta.imageHeight}px;`}></Image>
                    )}
                    <View className='workImg'></View>
                </View>
                <View className='btnItem'>
          <Button type='primary' onClick={this.submitWork}>{i18next.t('pass')}</Button>
          <Button type='warn' onClick={this.rejectWork}>{i18next.t('dismissed')}</Button>
          <Button style='background: #FFCC00;' type='warn' onClick={this.cancelWork}>{i18next.t('Give')}</Button>
          <Input placeholder={i18next.t('standard')} className='changeR' onChange={this.changeR}></Input>
                </View>
            </View>
    )
  }
}
