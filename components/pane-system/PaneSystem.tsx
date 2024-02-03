'use client';

import {
  PropsWithChildren,
  useEffect,
  useState,
  Children,
  useMemo,
  isValidElement,
  ReactElement,
  cloneElement,
  useCallback,
  useRef,
} from 'react';
import { PaneRowProps } from './PaneRow';
import { sizeToPixels } from '@/utils/conversion';
import { Size } from '@/types/types';

interface PaneSystemProps {
  height: string;
  rowHeights: string[];
}

const PaneSystem = ({
  height,
  rowHeights,
  children,
}: PropsWithChildren<PaneSystemProps>) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rowHeightPxs, setRowHeightPxs] = useState<number[]>([]);

  const [containerSize, setContainerSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  const onRowSplitterDrag = useCallback(
    (index: number) => (dy: number) => {
      const autoRowIndex = rowHeights.findIndex((h) => h === 'auto');

      if (autoRowIndex === index - 1) {
        setRowHeightPxs((prev) => {
          const clone = [...prev];
          clone[index] -= dy;
          clone[index + 1] += dy;
          return clone;
        });
      } else if (autoRowIndex === index + 1) {
        setRowHeightPxs((prev) => {
          const clone = [...prev];
          clone[index] += dy;
          clone[index + 1] -= dy;
          return clone;
        });
      }
    },
    [setRowHeightPxs, rowHeights],
  );

  // Calculate the container height.
  useEffect(() => {
    if (!ref.current) return;

    const onResize = () => {
      if (!ref.current) return;

      const { width, height } = ref.current.getBoundingClientRect();
      setContainerSize({ width, height });
    };

    window.addEventListener('resize', onResize);

    onResize();

    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Calculate the row heights in pixels.
  useEffect(() => {
    if (containerSize.height === 0) return;

    const nonAutoHeights = rowHeights.filter((height) => height !== 'auto');
    const autoHeights = rowHeights.filter((height) => height === 'auto');

    if (autoHeights.length > 1) {
      throw new Error('Only one row can have an auto height.');
    }

    const nonAutoHeightPxs = nonAutoHeights.map((height) =>
      sizeToPixels(height, containerSize.height),
    );
    const autoHeightPx =
      containerSize.height - nonAutoHeightPxs.reduce((a, b) => a + b, 0);
    const autoHeightIndex = rowHeights.findIndex((height) => height === 'auto');

    if (autoHeightIndex !== -1)
      nonAutoHeightPxs.splice(autoHeightIndex, 0, autoHeightPx);

    setRowHeightPxs(nonAutoHeightPxs);
  }, [rowHeights, containerSize]);

  const rows = useMemo(() => {
    if (rowHeightPxs.length === 0) return null;

    let top = 0;

    return Children.map(children, (row, index) => {
      if (!isValidElement(row)) return null;

      const r = cloneElement(row as ReactElement<PaneRowProps>, {
        key: index,
        index,
        top,
        height: rowHeightPxs[index],
        containerWidth: containerSize.width,
        onSplitterDrag: onRowSplitterDrag(index),
      });

      top += rowHeightPxs[index];

      return r;
    });
  }, [children, rowHeightPxs, containerSize, onRowSplitterDrag]);

  return (
    <div ref={ref} className="relative h-full" style={{ height }}>
      {rows}
    </div>
  );
};

export default PaneSystem;
