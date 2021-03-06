import Taro, {
  Component,
  Config
} from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/login/index',
      'pages/attribute_review/index',
      'pages/signup/index',
      'pages/rect_task/index',
      'pages/rect_review/index',
      'pages/count_task/index',
      'pages/count_review/index',
      'pages/collect_task/index',
      'pages/collect_review/index',
      'pages/phone_login/index',
      'pages/wechat_login/index',
      'pages/qq_login/index',
      'pages/reset_password/index',
      'pages/attribute_task/index',
      'pages/face_recognition_login/index',
      'pages/upload_faceImg/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentCatchError() {}

  render() {
    return (
      <Index />
    )
  }

}

Taro.render(<App />, document.getElementById('app'))
