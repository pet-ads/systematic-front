import React, { useState, useEffect, useRef, useCallback } from "react";

interface ResizeHandlerProps {
  ref: React.RefObject<HTMLDivElement | null>;
  isResizing: boolean;
}

interface ResizableProps {
  children: (props: ResizeHandlerProps) => React.ReactNode;
  onResize?: (width: number) => number | void;
  direction?: "horizontal" | "vertical";
  minWidth?: number;
  maxWidth?: number;
}

export const Resizable: React.FC<ResizableProps> = ({
  children,
  onResize,
  direction = "horizontal",
  minWidth = 50,
  maxWidth = 2000,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [startSize, setStartSize] = useState(0);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const node = ref.current;
      if (!node) return;

      const startPos = direction === "horizontal" ? e.clientX : e.clientY;
      const size =
        direction === "horizontal" ? node.offsetWidth : node.offsetHeight;

      setIsResizing(true);
      setStartPosition(startPos);
      setStartSize(size);
    },
    [direction]
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();

      const node = ref.current;
      if (!node || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const startPos =
        direction === "horizontal" ? touch.clientX : touch.clientY;
      const size =
        direction === "horizontal" ? node.offsetWidth : node.offsetHeight;

      setIsResizing(true);
      setStartPosition(startPos);
      setStartSize(size);
    },
    [direction]
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isResizing) return;

      const position = direction === "horizontal" ? clientX : clientY;
      const diff = position - startPosition;

      let newSize = startSize + diff;
      newSize = Math.max(minWidth, Math.min(maxWidth, newSize));

      if (onResize) {
        onResize(newSize);
      }
    },
    [
      isResizing,
      direction,
      startPosition,
      startSize,
      minWidth,
      maxWidth,
      onResize,
    ]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    },
    [handleMove]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    [handleMove]
  );

  const handleEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const resizeHandle = node.querySelector<HTMLElement>(".resize-handle");
    if (resizeHandle) {
      resizeHandle.addEventListener("mousedown", handleMouseDown);
      resizeHandle.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchend", handleEnd);
    document.addEventListener("touchcancel", handleEnd);

    return () => {
      if (resizeHandle) {
        resizeHandle.removeEventListener("mousedown", handleMouseDown);
        resizeHandle.removeEventListener("touchstart", handleTouchStart);
      }

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchend", handleEnd);
      document.removeEventListener("touchcancel", handleEnd);
    };
  }, [
    handleMouseDown,
    handleTouchStart,
    handleMouseMove,
    handleTouchMove,
    handleEnd,
  ]);

  return children({ ref, isResizing });
};
