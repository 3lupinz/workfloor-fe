'use client';

import {
  Children,
  PropsWithChildren,
  ReactElement,
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { InnerPane, PaneProps } from './Pane';
import { sizeToPixels } from '@/utils/conversion';
import RowSplitter from './RowSplitter';
import { limit } from '@/utils/number';

export interface PaneRowProps extends PropsWithChildren {
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  splitter?: 'top' | 'bottom';
}

const PaneRow = ({ children }: PaneRowProps) => children;

export default PaneRow;

export interface InnerPaneRowProps {
  index?: number;
  containerWidth: number;
  top?: number;
  height?: number;
  onColumnWidthChange?: (
    rowIndex: number,
    colIndex: number,
    width: number,
  ) => void;
  columnMinWidths?: string[];
  columnMaxWidths?: string[];
  splitter?: 'top' | 'bottom';
  onSplitterDrag?: (dy: number) => void;
}

export const InnerPaneRow = ({
  containerWidth,
  top,
  height,
  splitter,
  onSplitterDrag,
  children,
}: PropsWithChildren<InnerPaneRowProps>) => {
  // The widths of the Pane components in pixels.
  const [paneWidthPxs, setPaneWidthPxs] = useState<number[]>([]);

  // Gather Pane components in this row.
  const panes = useMemo(() => {
    const array = Children.toArray(children);

    if (array.length === 0)
      throw new Error('PaneRow must have at least one Pane.');

    return array as ReactElement<PaneProps>[];
  }, [children]);

  // Get the widths of the Pane components.
  const paneWidths = useMemo<string[]>(() => {
    return panes.map((p) => p.props.width ?? 'auto');
  }, [panes]);

  // Calculate the column min widths in pixels.
  const paneMinWidthPxs = useMemo<number[]>(() => {
    return panes.map((p) => {
      const minWidth = p.props.minWidth ?? 0;
      return sizeToPixels(minWidth, containerWidth);
    });
  }, [panes, containerWidth]);

  // Calculate the column max widths in pixels.
  const paneMaxWidthPxs = useMemo<number[]>(() => {
    return panes.map((p) => {
      const maxWidth = p.props.maxWidth ?? '100%';
      return sizeToPixels(maxWidth, containerWidth);
    });
  }, [panes, containerWidth]);

  // Calculate the column widths in pixels.
  useEffect(() => {
    if (containerWidth === 0) return;

    const nonAutoWidths = paneWidths.filter((w) => w !== 'auto');
    const autoWidths = paneWidths.filter((w) => w === 'auto');

    if (autoWidths.length > 1) {
      throw new Error('Only one Pane can have auto width');
    }

    const nonAutoWidthPxs = nonAutoWidths
      .map((w) => sizeToPixels(w, containerWidth))
      .map((n, i) => limit(n, paneMinWidthPxs[i], paneMaxWidthPxs[i]));

    const autoWidthPx =
      containerWidth - nonAutoWidthPxs.reduce((a, b) => a + b, 0);
    const autoWidthIndex = paneWidths.findIndex((w) => w === 'auto');

    if (autoWidthIndex !== -1)
      nonAutoWidthPxs.splice(autoWidthIndex, 0, autoWidthPx);

    setPaneWidthPxs(nonAutoWidthPxs);
  }, [containerWidth, paneWidths, paneMinWidthPxs, paneMaxWidthPxs]);

  // Drag handler for the splitters.
  const onPaneSplitterDrag = useCallback(
    (index: number) => (dx: number) => {
      const autoPaneIndex = paneWidths.findIndex((w) => w === 'auto');

      if (autoPaneIndex === index - 1) {
        // The splitter is on the right side of the auto pane.
        setPaneWidthPxs((prev) => {
          const clone = [...prev];

          const totalWidth = clone[index - 1] + clone[index];
          const rightWidth = limit(
            clone[index] - dx,
            paneMinWidthPxs[index],
            paneMaxWidthPxs[index],
          );

          clone[index - 1] = totalWidth - rightWidth;
          clone[index] = rightWidth;

          return clone;
        });
      } else if (autoPaneIndex === index + 1) {
        // The splitter is on the left side of the auto pane.
        setPaneWidthPxs((prev) => {
          const clone = [...prev];

          const totalWidth = clone[index] + clone[index + 1];
          const leftWidth = limit(
            clone[index] + dx,
            paneMinWidthPxs[index],
            paneMaxWidthPxs[index],
          );

          clone[index] = leftWidth;
          clone[index + 1] = totalWidth - leftWidth;

          return clone;
        });
      }
    },
    [paneWidths, paneMinWidthPxs, paneMaxWidthPxs],
  );

  const cols = useMemo(() => {
    let left = 0;

    return panes.map((pane, index) => {
      const c = createElement(
        InnerPane,
        {
          key: index,
          left,
          width: paneWidthPxs[index],
          splitter: pane.props.splitter,
          onSplitterDrag: onPaneSplitterDrag(index),
        },
        pane.props.children,
      );

      left += paneWidthPxs[index];

      return c;
    });
  }, [panes, paneWidthPxs, onPaneSplitterDrag]);

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
        <RowSplitter offsetTop={height!} onDrag={onSplitterDrag} />
      )}
    </div>
  );
};
