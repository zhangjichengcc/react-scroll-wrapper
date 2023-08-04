# ReactScrollWrapper

> 无限滚动的 react 组件，支持横向纵，滚动方向及速度的配置，支持 `typeScript`

## how to use

- use

  ``` shell
  npm i @zhangjicheng/react-scroll-wrapper

  pnpm add @zhangjicheng/react-scroll-wrapper

  yarn add @zhangjicheng/react-scroll-wrapper
  ```

  ``` js
  import ScrollWrapper from '@zhangjicheng/react-scroll-wrapper';

  import ScrollWrapper from '@zhangjicheng/react-scroll-wrapper/dist/components/ScrollWrapper';
  ```

- example

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

- 纵向滚动时，当滚动内容高度小于容器高度，则不会滚动; 横向滚动同理；
- 容器高度默认继承父级高度；
