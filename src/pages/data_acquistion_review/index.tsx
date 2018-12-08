import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtButton, AtIcon, AtCheckbox } from 'taro-ui'
import NavBar from '../component/navBar/index'
import './index.scss'
import img1 from '../../image/1.jpg'
import img2 from '../../image/2.jpg'
import img3 from '../../image/3.jpg'
import img4 from '../../image/4.jpg'
import img5 from '../../image/5.jpg'
import img6 from '../../image/6.jpg'
import img7 from '../../image/7.jpg'
import img8 from '../../image/8.jpg'
import img9 from '../../image/9.jpg'
import img10 from '../../image/10.jpg'
import NavBar from '../../../.temp/pages/component/navBar/index';
import { fetchWork } from '../../utils/beevalley'
export default class reviewDAata extends Taro.Component {
    constructor() {
        super(...arguments)

        this.state = {
            imgArr: [{ img: img1 }, { img: img2 }, { img: img3 }, { img: img4 }, { img: img5 }, { img: img6 }, { img: img7 }, { img: img8 }, { img: img9 }, { img: img10 }],
            
            checkedList: ['list1']
        }

        this.checkboxOption = [{
                value: 'list1',
                label: '选择',
            }
        ]
    }

    handleChange (value) {
        this.setState({
            checkedList: value
        })
    }

    componentDidMount () {

        // fetchWork(this.apiToken, 'collect', 1 ,this.packageId).then(res => {
        //     console.log(res)
        // })
    }

    render() {

        let { imgArr } = this.state;
        let showImg = imgArr.map((item, index) => {
            return (
                <View className="show-item">
                    <View className="eg img-item">
                        <View className="eg-item">示例</View>
                        <Image src={item.img} className="img"></Image>
                    </View>
                    <View className="img-item">
                        <View className="showImg">
                            <AtCheckbox 
                                options={this.checkboxOption}
                                selectedList={this.state.checkedList}
                                onChange={this.handleChange.bind(this)}
                            />
                            <Image src={item.img} className="img"></Image>
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
                        <View className="content-list">
                            <View className="list-item">1 每组图片10张以上，同一组目标对象必须是同一个老年人；</View>
                            <View className="list-item">2 老年人应在60岁以上，男女不限；</View>
                            <View className="list-item">3 图像来源可以是监控摄像头，手机自拍，拍别人，不能是网上搜索的图片；</View>
                            <View className="list-item">4 每张图片的人脸必须五官清晰可见，能够准确辨认出身份；</View>
                            <View className="list-item">5 所有图片应避免在同一时刻、同一场景下拍摄，尽量保证场景差异性越大越好（比如在不同的餐厅、景区、商场等）；</View>
                            <View className="list-item">6 所有图片的人脸角度差异性越大越好（比如在保证五官清晰的前提下，有不同角度的侧脸、低头、抬头等）；</View>
                            <View className="list-item">7 同一张图片内若有多张人脸，目标人脸必须最大。</View>
                        </View>
                        <View className="content-img">
                            <Image src={img1} className="img"></Image>
                        </View>
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
                    <AtButton type="primary" circle className="btn1">通过</AtButton>
                    <AtButton type="primary" circle className="btn1">驳回</AtButton>
                </View>
            </View>
        )
    }
}