import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtButton, AtIcon, AtCheckbox } from 'taro-ui'
import NavBar from '../component/navBar/index'
import './index.scss'
import { fetchReview, downloadReviewFiles, submitReview } from '../../utils/beevalley'
export default class reviewDAata extends Taro.Component {
    constructor() {
        super(...arguments)

        this.state = {
            images: [],
            details: []
        }

        this.checkboxOption = [{
                value: 'checked',
                label: '不合格',
            }
        ]

        this.apiToken = Taro.getStorageSync('apiToken');

    }

    handleChange (index, value) {
        this.setState(prevState => {
            let updated = prevState.images
            updated[index].checked = value
            return {images: updated}
        })
    }

    componentDidMount () {
        this.packageId = this.$router.params.packageId
        Taro.showLoading({
            title: 'loading',
            mask: true
        })
        this.nextWork()
    }

    defaultErrorHandling = () => {
      Taro.hideLoading()
      Taro.navigateBack({
              delta: 1
          })
    }

    nextWork = () => {

        this.setState({images: []})
        this.reviewId = null
        fetchReview(this.apiToken, 'collect', 1 ,this.packageId).then(res => {
            // console.log(res)
            if (res.length > 0) {
                let review = res[0],
                sampleImages = review.meta.samples,
                imageFiles = review.work.result
                this.reviewId = review.id
                imageFiles.forEach((item, index) => {
                    downloadReviewFiles(this.apiToken, review.id, item).then(res => {
                        // TODO
                        let imgBase64 = 'data:image/jpeg;base64,' + Taro.arrayBufferToBase64(new Uint8Array(res));
                        this.setState(prevState => {
                            let updated = prevState.images
                            updated[index].candidate = imgBase64
                            updated[index].id = item
                            return {images: updated}
                        })
                    })                    
                })
                let images = sampleImages.map((item) => {
                    return {sample: item, checked: []}
                })
                this.setState({images: images, details: review.work.details})
                Taro.hideLoading()
            } else {
                Taro.hideLoading()
                Taro.showToast({
                    title: '没有任务了'
                })
            }
        })

    }

    getMessage = (details) => {
        return details.map((item, index) => {
            return (
                <View className="content-list">
                    <View className="list-item">{index + 1} {item}；</View>
                </View>
            )
        })
        
    }

    submitWork = () => {
        let rejected = this.state.images.filter(item => item.checked.length > 0).map(item => item.id)
        if (!this.reviewId || rejected.length > 0) return;
        Taro.showLoading({
            title: 'loading',
            mask: true
        })
        submitReview(this.apiToken, this.reviewId, true)
        .then(() => this.nextWork())
        .catch(this.defaultErrorHandling)
    }

    rejectWork = () => {
        let rejected = this.state.images.filter(item => item.checked.length > 0).map(item => item.id)
        if (!this.reviewId || rejected.length === 0) return;
        Taro.showLoading({
            title: 'loading',
            mask: true
        })
        submitReview(this.apiToken, this.reviewId, false, rejected)
        .then(() => this.nextWork())
        .catch(this.defaultErrorHandling)
    }

    render() {

        let { images, details } = this.state;
        let showImg = images.map((item, index) => {
            return (
                <View className="show-item">
                    <View className="eg img-item">
                        <View className="eg-item">示例</View>
                        <Image src={item.sample} className="img"></Image>
                    </View>
                    <View className="img-item">
                        <View className="showImg">
                            <AtCheckbox 
                                options={this.checkboxOption}
                                selectedList={item.checked}
                                onChange={this.handleChange.bind(this, index)}
                            />
                            <Image src={item.candidate} className="img"></Image>
                        </View>
                    </View>
                </View>
            )
        })
        return (
            <View className="data-wrap">
                <View className="main-content">
                    <View className="task_demand">
                        <View className="panel__title">第1步</View>
                        <View className="title">审核要求</View>
                        {this.getMessage(details)}
                    </View>
                </View>
                <View className="user-photo">
                    <View className="user-photo-wrap">
                        <View className="title">
                            <AtIcon size="30" value="image" color="orange"></AtIcon>
                            <Text className="font">审核下列图片</Text>
                        </View>
                        <View className="take-photo">
                            {showImg}
                        </View>
                        <View className="info">将不合格的图片勾选，并驳回</View>
                        <View className="cenggao"></View>
                    </View>
                </View>
                <View className="cengHeight"></View>
                <View className="top">
                    <NavBar title="老人图像审核"></NavBar>
                    <View className="top-info">0/1 已添加</View>
                </View>

                <View className="bottom-btn">
                    <AtButton type="primary" circle className="btn1" onClick={this.submitWork}>通过</AtButton>
                    <AtButton type="primary" circle className="btn1" onClick={this.rejectWork}>驳回</AtButton>
                </View>
            </View>
        )
    }
}