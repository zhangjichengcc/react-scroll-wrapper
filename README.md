# ReactScrollWrapper

> 基于 React，

采用 rollup 进行项目打包，pnpm 作为包管理器，插件以 react@16 less 进行开发

## how to use

- 安装

  ``` shell
  npm i @zhangjicheng/react-scroll-wrapper
  ```

- 使用

  ``` js
  import { FC } from react;
  import ScrollWrapper from '@zhangjicheng/react-scroll-wrapper';

  const View: FC = () => {

    return (
      <div style={{height: 100}}>
        <ScrollWrapper>
          <ul>
             <li>
                {
                  'ScrollWrapper是一个创建无限滚动效果的功能组件。它包含以下属性:'
                }
              </li>
              <li>{'@param {Props} props - props对象包含以下属性:'}</li>
              <li>{'children: 滚动元素主体.'}</li>
              <li>{'speed: 滚动动画的速度 (default value: 1).'}</li>
              <li>{'direction: 滚动方向 (default value: "bt").'}</li>
              <li>{'direction: 滚动方向 (default value: "bt").'}</li>
              <li>{'onScroll: 滚动回调'}</li>
              <li>{'pauseOnHover: 是否鼠标移入暂停'}</li>
              <li>{'autoScroll: 是否自动滚动'}</li>
              <li>{'disabled: 是否禁用滚动'}</li>
              <li>{'@return {JSX.Element} - 渲染的组件。'}</li>
          </ul>
        </ScrollWrapper>
      <div>
    )
  }

  export default View;

  ```

## ⚠️注意

当滚动内容高度/宽度小于容器高度/宽度，则不会滚动
