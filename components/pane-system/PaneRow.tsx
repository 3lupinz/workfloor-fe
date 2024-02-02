'use client';

import {
  Children,
  PropsWithChildren,
  ReactElement,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PaneProps } from './Pane';
import { sizeToPixels } from '@/utils/conversion';
import RowSplitter from './RowSplitter';

export interface PaneRowProps {
  index?: number;
  containerWidth?: number;
  top?: number;
  height?: number;
  onHeightChange?: (index: number, height: number) => void;
  columnWidths: string[];
  onColumnWidthChange?: (
    rowIndex: number,
    colIndex: number,
    width: number,
  ) => void;
  splitter?: 'top' | 'bottom';
  onSplitterDrag?: (dy: number) => void;
}

const PaneRow = ({
  containerWidth = 0,
  top = 0,
  height = 0,
  onHeightChange,
  columnWidths,
  splitter,
  onSplitterDrag,
  children,
}: PropsWithChildren<PaneRowProps>) => {
  const [columnWidthPxs, setColumnWidthPxs] = useState<number[]>([]);

  const onColumnSplitterDrag = useCallback(
    (index: number) => (dx: number) => {
      const autoColumnIndex = columnWidths.findIndex((w) => w === 'auto');

      if (autoColumnIndex === index - 1) {
        setColumnWidthPxs((prev) => {
          const clone = [...prev];
          clone[index - 1] += dx;
          clone[index] -= dx;
          return clone;
        });
      } else if (autoColumnIndex === index + 1) {
        setColumnWidthPxs((prev) => {
          const clone = [...prev];
          clone[index] += dx;
          clone[index + 1] -= dx;
          return clone;
        });
      }
    },
    [columnWidths],
  );

  // Calculate the column widths in pixels.
  useEffect(() => {
    if (containerWidth === 0) return;

    const nonAutoWidths = columnWidths.filter((w) => w !== 'auto');
    const autoWidths = columnWidths.filter((w) => w === 'auto');

    if (autoWidths.length > 1) {
      throw new Error('Only one column can have auto width');
    }

    const nonAutoWidthPxs = nonAutoWidths.map(sizeToPixels, containerWidth);
    const autoWidthPx =
      containerWidth - nonAutoWidthPxs.reduce((a, b) => a + b);
    const autoWidthIndex = columnWidths.findIndex((w) => w === 'auto');

    if (autoWidthIndex !== -1)
      nonAutoWidthPxs.splice(autoWidthIndex, 0, autoWidthPx);

    setColumnWidthPxs(nonAutoWidthPxs);
  }, [columnWidths, containerWidth]);

  const cols = useMemo(() => {
    if (columnWidthPxs.length === 0) return null;

    let left = 0;

    return Children.map(children, (child, index) => {
      if (!isValidElement(child)) return null;

      const c = cloneElement(
        child as ReactElement<Omit<PaneProps, 'id'>>,
        {
          left,
          width: columnWidthPxs[index],
          onSplitterDrag: onColumnSplitterDrag(index),
        } as PaneProps,
      );

      left += columnWidthPxs[index];

      return c;
    });
  }, [children, columnWidthPxs, onColumnSplitterDrag]);

  return (
    <div
      className="pane-row absolute w-full bg-zinc-900 border-b border-zinc-800 last-of-type:border-b-0"
      style={{
        top: `${top}px`,
        height: `${height}px`,
      }}
    >
      {splitter === 'top' && onSplitterDrag && (
        <RowSplitter offsetTop={0} onDrag={onSplitterDrag} />
      )}
      {cols}
      {splitter === 'bottom' && onSplitterDrag && (
        <RowSplitter offsetTop={height} onDrag={onSplitterDrag} />
      )}
    </div>
  );
};

export default PaneRow;
