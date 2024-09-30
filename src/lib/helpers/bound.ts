export type Direction = "left" | "right" | "top" | "bottom";

function getDirectionMostOfElements(direction: Direction, elements: Element[]) {
  if (elements.length === 1) {
    return elements[0];
  }
  return elements.reduce((memo, value) => {
    if (!memo) {
      return value;
    }

    const valueDirection = getBoundingClientRect(value)[direction];
    const memoDirection = getBoundingClientRect(memo)[direction];

    if (direction === "left" || direction === "top") {
      if (valueDirection < memoDirection) {
        return value;
      }
    } else {
      if (valueDirection > memoDirection) {
        return value;
      }
    }
    return memo;
  }, null as Element | null) as Element;
}

function getAggregateRectOfElements(elements: Element[]) {
  if (!elements.length) {
    return null;
  }

  const { top } = getBoundingClientRect(
    getDirectionMostOfElements("top", elements)
  );
  const { left } = getBoundingClientRect(
    getDirectionMostOfElements("left", elements)
  );
  const { bottom } = getBoundingClientRect(
    getDirectionMostOfElements("bottom", elements)
  );
  const { right } = getBoundingClientRect(
    getDirectionMostOfElements("right", elements)
  );
  const width = right - left;
  const height = bottom - top;
  return {
    top,
    left,
    bottom,
    right,
    width,
    height,
  };
}

export interface Dimensions
  extends Pick<
    DOMRect,
    "top" | "left" | "bottom" | "width" | "right" | "height" | 'x' | 'y'
  > {}



export function getBoundingClientRect(el: Element): Dimensions {

  // const computed = getComputedStyle(el);
  // const display = computed.display;
  // if (display.includes("inline") && el.children.length) {
  //   const elRect = el.getBoundingClientRect();
  //   const aggregateRect = getAggregateRectOfElements(Array.from(el.children))!;

  //   if (elRect.width > aggregateRect?.width) {
  //     return {
  //       ...aggregateRect,
  //       width: elRect.width,
  //       left: elRect.left,
  //       right: elRect.right,
  //     };
  //   }
  //   return aggregateRect;
  // }

  // 子元素的bound - 父元素的bound 为子元素的相对位置
  const parentBound = el.parentElement?.getBoundingClientRect()
  const bound = el.getBoundingClientRect()
  return {
    // bound属性不可枚举,对象延展符无效
    ...bound.toJSON(),
    left: parentBound? bound.left - parentBound.left : bound.left,
    top: parentBound? bound.top - parentBound.top : bound.top,
  };
}
