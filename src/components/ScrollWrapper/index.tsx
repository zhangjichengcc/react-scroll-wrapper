import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  WheelEvent,
} from "react";

import styles from "./index.less";

type Direction = "tb" | "bt" | "lr" | "rl";

type DirectionCoord = {
  x: number;
  y: number;
};

interface Props {
  children: ReactNode;
  /** 滚动速度，每帧滚动距离 */
  speed?: number;
  /**
   * @param direction 滚动方向
   * - tb 表示向下滚动
   * - bt 表示向上滚动
   * - rl 表示向左滚动
   * - lr 表示向右滚动
   * @default bt
   */
  direction?: Direction;
  /**
   * 滚动回调
   */
  onScroll?: (coord: DirectionCoord) => void;
  /**
   * 是否自动滚动
   */
  autoScroll?: boolean;
  /**
   * 是否鼠标移入暂停
   */
  pauseOnHover?: boolean;
  /**
   * 是否禁用滚动
   */
  disabled?: boolean;
  /**
   * 容器样式
   */
  style?: React.CSSProperties;
  /**
   * 容器类名
   */
  className?: string;
}

/**
 * 获取滚动方向
 *
 * @param {Direction} direction - 滚动方向
 * @return {"horizontal" | "vertical"} - 滚动类型
 */
function getScrollDirection(direction: Direction): "horizontal" | "vertical" {
  const horizontalArr = ["lr", "rl"];
  const verticalArr = ["tb", "bt"];
  return horizontalArr.includes(direction)
    ? "horizontal"
    : verticalArr.includes(direction)
    ? "vertical"
    : "vertical";
}

/**
 * InfiniteScroller是一个创建无限滚动效果的功能组件。它包含以下道具:
 *
 * @param {Props} props - props对象包含以下属性:
 *   - children: 滚动元素主体.
 *   - speed: 滚动动画的速度 (default value: 1).
 *   - direction: 滚动方向 (default value: "bt").
 *   - onScroll: 滚动回调
 *   - pauseOnHover: 是否鼠标移入暂停
 *   - autoScroll: 是否自动滚动
 *   - disabled: 是否禁用滚动
 *
 * @return {JSX.Element} - 渲染的组件。
 */
const ScrollWrapper: FC<Props> = (props) => {
  const {
    children,
    speed = 1,
    direction = "bt",
    onScroll,
    pauseOnHover = true,
    autoScroll = true,
    disabled = false,
  } = props;

  /** 外层容器 */
  const containerRef = useRef<HTMLDivElement>(null);
  /** 滚动容器 */
  const scrollerRef = useRef<HTMLDivElement>(null);
  /** 滚动内容容器 */
  const scrollContentRef = useRef<HTMLDivElement>(null);
  /** 记录滚动位置 */
  const scrollDirectionRef = useRef<DirectionCoord>({ x: 0, y: 0 });
  const animationFrame = useRef(0);

  /** 容器滚动内容属性 */
  const containerScrollRect = useRef({ width: 0, height: 0 });

  /** 滚动方向 */
  const _direction = getScrollDirection(direction);

  // 窗口是否可以滚动
  const [needScroll, setNeedScroll] = useState(false);

  /**
   * 滚动方法
   * @param {number} direction 滚动距离
   */
  function scroll(displacement?: number) {
    const curDirection =
      _direction === "vertical"
        ? (displacement || speed) >= 0
          ? "bt"
          : "tb"
        : (displacement || speed) >= 0
        ? "rl"
        : "lr";

    // 原点位置
    const originalPoint = {
      x: containerScrollRect.current.width,
      y: containerScrollRect.current.height,
    };

    // 向下滚动，当滚动到顶部时，复位
    if (curDirection === "tb" && scrollDirectionRef.current.y <= 0) {
      scrollDirectionRef.current.y = originalPoint.y;
    }

    // 向上滚动，当滚动到底部（复制后滚动内容高度的一半），复位
    if (
      curDirection === "bt" &&
      scrollDirectionRef.current.y >= originalPoint.y
    ) {
      scrollDirectionRef.current.y = 0;
    }

    // 向右滚动，当滚动到左侧顶部，复位
    if (curDirection === "lr" && scrollDirectionRef.current.x <= 0) {
      scrollDirectionRef.current.x = originalPoint.x;
    }

    // 向左滚动，当滚动到右侧顶部，复位
    if (
      curDirection === "rl" &&
      scrollDirectionRef.current.x >= originalPoint.x
    ) {
      scrollDirectionRef.current.x = 0;
    }

    // 更新属性
    if (scrollerRef.current) {
      scrollerRef.current.style.transform = `translate3d(-${scrollDirectionRef.current.x}px, -${scrollDirectionRef.current.y}px, 0)`;
    }

    onScroll?.(scrollDirectionRef.current);
  }

  // 动画开始方法
  function animate() {
    if (_direction === "vertical") {
      scrollDirectionRef.current.y += speed;
    }
    if (_direction === "horizontal") {
      scrollDirectionRef.current.x += speed;
    }
    scroll();
    animationFrame.current = requestAnimationFrame(animate);
  }

  function removeAnimationFrame() {
    cancelAnimationFrame(animationFrame.current);
  }

  function startAnimationFrame() {
    animationFrame.current = requestAnimationFrame(animate);
  }

  /**
   * 鼠标移入滚动事件
   * ? 使用 useCallback 来缓存方法，防止频繁渲染导致事件频繁绑定
   */
  const handleMouseWheel: EventListener = useCallback(
    (event) => {
      const wheelEvent = event as unknown as WheelEvent<HTMLDivElement>;
      event.preventDefault();
      if (!needScroll || disabled) return; // 防止无需滚动状态下，触发滚动
      const direction =
        _direction === "vertical" ? wheelEvent.deltaY : wheelEvent.deltaX;
      if (_direction === "vertical") {
        scrollDirectionRef.current.y += direction;
      }
      if (_direction === "horizontal") {
        scrollDirectionRef.current.x += wheelEvent.deltaX;
      }
      scroll(direction);
    },
    [needScroll]
  );

  function onMouseEnter() {
    if (pauseOnHover) removeAnimationFrame();
  }

  function onMouseLeave() {
    if (needScroll && pauseOnHover && autoScroll) {
      startAnimationFrame();
    }
  }

  /**
   * 初始化
   *
   * @description 初始化基本属性
   */
  function init() {
    console.log("init ScrollWrapper");
    // removeAnimationFrame();
    // 窗口宽高
    const { height: containerHeight, width: containerWidth } =
      containerRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
    const containerScrollHeight = scrollContentRef.current?.scrollHeight || 0,
      containerScrollWidth = scrollContentRef.current?.scrollWidth || 0;

    // 滚动内容属性
    containerScrollRect.current = {
      width: containerScrollWidth,
      height: containerScrollHeight,
    };

    const _needScroll =
      _direction === "vertical"
        ? containerHeight < containerScrollHeight
        : containerWidth < containerScrollWidth;

    autoScroll && _needScroll && startAnimationFrame();
    setNeedScroll(_needScroll);

    return () => {
      autoScroll && _needScroll && removeAnimationFrame();
    };
  }

  useEffect(init, [children, speed]);

  useEffect(
    function () {
      containerRef.current?.addEventListener("wheel", handleMouseWheel, {
        passive: false,
      });
      return () => {
        containerRef.current?.removeEventListener("wheel", handleMouseWheel);
      };
    },
    [handleMouseWheel] // 监听handleMouseWheel 变化，每次都能获取最新的 handleMouseWheel，以保证state为最新
  );

  return (
    <div
      className={styles.container}
      ref={containerRef}
      // ? React并不直接支持passive属性的设置。
      // ! onWheel={handleMouseWheel}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        ref={scrollerRef}
        style={_direction === "horizontal" ? { display: "flex" } : {}}
      >
        <div
          ref={scrollContentRef}
          style={{ wordBreak: "keep-all", overflow: "hidden" }}
        >
          {children}
        </div>
        {needScroll && <div style={{ wordBreak: "keep-all" }}>{children}</div>}
      </div>
    </div>
  );
};

export default ScrollWrapper;
