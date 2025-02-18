import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useDOMKeyboardCoordinates, xySort } from './MultiColumnKeyboardCoordinateGetter';

const getBoundingClientRectSpy = jest.fn(() => {
  const calls = getBoundingClientRectSpy.mock.calls.length;

  return {
    top: 0,
    left: 10 * calls
  };
});

// global.element.getBoundingClientRect = getBoundingClientRectSpy;

jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(getBoundingClientRectSpy);

const wrapper = ({ children }) => (
  <>
    <ol id="testId">
      <li>
        <div className="listItemContent" data-draggable-item="settings">Settings</div>
      </li>
      <li>
        <div className="listItemContent" data-draggable-item="users">users</div>
      </li>
      <li>
        <div className="listItemContent" data-draggable-item="inventory">inventory</div>
      </li>
    </ol>
    { children }
  </>
);

describe('MultiColumnKeyboardCoordinateGetter', () => {
  describe('coordinateGetterHook', () => {
    let rendered;

    beforeEach(async () => {
      getBoundingClientRectSpy.mockClear();
      rendered = await renderHook(() => useDOMKeyboardCoordinates({ id: 'testId' }), { wrapper });
    });

    it('gets lower coordinates', () => {
      expect(rendered.result.current.getter({ code: 'ArrowDown' }, { context: { active: { id: 'users' } } })).toEqual({ x: 30, y: 0 });
    });

    it('gets higher coordinates', () => {
      expect(rendered.result.current.getter({ code: 'ArrowUp' }, { context: { active: { id: 'users' } } })).toEqual({ x: 10, y: 0 });
    });
  });

  describe('xySort', () => {
    it('sorts an array of rectangles by their coordinate positions by x and secondarily by y', () => {
      const unsorted = [
        { value: { left: 0, top: 0 } },
        { value: { left: 30, top: 10 } },
        { value: { left: 0, top: 20 } },
        { value: { left: 30, top: 0 } },
        { value: { left: 0, top: 10 } },
      ];

      const expected = [
        { value: { left: 0, top: 0 } },
        { value: { left: 0, top: 10 } },
        { value: { left: 0, top: 20 } },
        { value: { left: 30, top: 0 } },
        { value: { left: 30, top: 10 } },
      ];

      expect(unsorted.sort(xySort)).toEqual(expected);
    });
  });
});
