import { useRef } from 'react';
import {
  KeyboardCode,
} from '@dnd-kit/core';

import listCss from './AppOrderList.css';

function xySort(a, b) {
  if (a.value.left === b.value.left) {
    return a.value.top - b.value.top;
  } else {
    return a.value.left - b.value.left;
  }
}

const collectDOMRects = (id) => {
  const elements = document.querySelectorAll(`#${id} .${listCss.listItemContent}`);
  const rects = [];

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    rects.push({
      name: el.getAttribute('data-draggable-item'),
      value: el.getBoundingClientRect()
    });
  }

  return rects;
};

export const useDOMKeyboardCoordinates = ({ id }) => {
  const MultiColumnKeyboarCoordinateGetter = useRef((
    event,
    {
      context: {
        active,
      }
    }
  ) => {
    // dndkit doesn't include the most up-to-date state of dom rects,
    // so we build our own from the dom and sort them by coordinates - this
    // mainly helps with the shift from the bottom of one column to the top of the next column
    // and vice-versa
    const draggableArray = collectDOMRects(id);

    // sort rects by x, by y...
    draggableArray.sort(xySort);

    const currentIndex = draggableArray.findIndex(c => c.name === active.id);

    let nextItem;

    let nextRect;

    switch (event.code) {
      case KeyboardCode.Down:
        nextItem = draggableArray[currentIndex + 1];

        if (nextItem) {
          nextRect = nextItem.value;

          return {
            x: nextRect.left,
            y: nextRect.top,
          };
        }
        break;
      case KeyboardCode.Up:
        nextItem = draggableArray[currentIndex - 1];

        if (nextItem) {
          nextRect = nextItem.value;

          return {
            x: nextRect.left,
            y: nextRect.top,
          };
        }
        break;
      default:
        break;
    }

    return undefined;
  });

  return {
    getter: MultiColumnKeyboarCoordinateGetter.current
  };
};
