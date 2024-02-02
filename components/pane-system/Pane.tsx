'use client';

import { PropsWithChildren } from 'react';
import ColumnSplitter from './ColumnSplitter';

export interface PaneProps {
  id: string;
  index?: number;
  left?: number;
  width?: number;
  splitter?: 'left' | 'right';
  onSplitterDrag?: (dx: number) => void;
}

const Pane = ({
  id,
  left = 0,
  width = 0,
  splitter,
  onSplitterDrag,
  children,
}: PropsWithChildren<PaneProps>) => {
  return (
    <div
      className="pane absolute h-full bg-zinc-900 border-r border-zinc-800 last-of-type:border-r-0"
      style={{
        left: `${left}px`,
        width: `${width}px`,
      }}
    >
      {splitter === 'left' && onSplitterDrag && (
        <ColumnSplitter offsetLeft={0} onDrag={onSplitterDrag} />
      )}
      {children}
      {splitter === 'right' && onSplitterDrag && (
        <ColumnSplitter offsetLeft={width} onDrag={onSplitterDrag} />
      )}
    </div>
  );
};

export default Pane;
