import { chakra } from '@chakra-ui/react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

type FitTextProps = {
  children: string;
};

// Shrink-to-fit tile label, the way NYT Connections handles long words:
// text wraps on spaces but never mid-word, and if the longest word is still
// wider than the tile, the whole label scales down just enough to fit.
// Scale is computed from the measured render, so it adapts to any word list,
// tile size, or font — no hardcoded character thresholds.
export const FitText = ({ children }: FitTextProps) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  // Hide the label until it has been measured once, so an oversized first
  // paint is never visible. Any successful measurement reveals it.
  const [settled, setSettled] = useState(false);

  const measure = useCallback(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;
    // Zero size means we're hidden or mid-layout (e.g. the other breakpoint's
    // grid) — applying a scale of 0 would blank the label, so skip.
    if (box.clientWidth === 0 || box.clientHeight === 0) return;
    // Measure the text's natural size with the transform and the width
    // constraint both removed. scrollWidth on a constrained, overflowing box
    // under-reports the real glyph run, which is what clipped long words.
    // Neutralize the applied transform and width inflation before measuring,
    // otherwise each measurement would feed on the previous one's output.
    const previousTransform = text.style.transform;
    const previousWidth = text.style.width;
    text.style.transform = 'none';

    // Widest single unbreakable word: the label can wrap on spaces, but a word
    // longer than the tile is what forces the whole label to scale down.
    text.style.width = 'min-content';
    const widestWord = text.getBoundingClientRect().width;

    // Height the label needs once it wraps at the tile's real width.
    text.style.width = `${box.clientWidth}px`;
    const wrappedHeight = text.getBoundingClientRect().height;

    text.style.transform = previousTransform;
    text.style.width = previousWidth;

    setScale(
      Math.min(
        1,
        box.clientWidth / Math.max(1, widestWord),
        box.clientHeight / Math.max(1, wrappedHeight),
      ),
    );
    setSettled(true);
  }, []);

  useLayoutEffect(() => {
    measure();
    // Layout can settle a frame after mount (web fonts swapping in,
    // aspect-ratio boxes resolving), so measure again on the next frame.
    const frame = requestAnimationFrame(() => measure());
    // Wrapped rather than passed directly so the event argument these
    // callbacks receive never reaches measure().
    const remeasure = () => measure();
    const observer = new ResizeObserver(remeasure);
    if (boxRef.current) observer.observe(boxRef.current);
    if (textRef.current) observer.observe(textRef.current);
    // Viewport resize / phone rotation: the observer above should catch it,
    // but a window listener is the reliable cross-browser fallback.
    window.addEventListener('resize', remeasure);
    // Text metrics change once the web fonts finish loading.
    document.fonts?.ready.then(remeasure).catch(() => undefined);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', remeasure);
    };
  }, [measure, children]);

  return (
    <chakra.div ref={boxRef} display="flex" alignItems="center" justifyContent="center" w="100%" h="100%">
      {/* overflowWrap/wordBreak are explicitly "normal": Chakra's global reset sets
          overflow-wrap: break-word on body, which is inherited and would let long
          words break mid-word — hiding the overflow the measurement relies on. */}
      {/* The element is widened by 1/scale and then scaled back down, so the text
          lays out with the room it needs *before* shrinking. Scaling a
          100%-width box instead would leave the text wrapping against the
          unscaled width and still clip. */}
      <chakra.div
        ref={textRef}
        w={`${100 / scale}%`}
        textAlign="center"
        whiteSpace="normal"
        overflowWrap="normal"
        wordBreak="normal"
        transform={`scale(${scale})`}
        transformOrigin="center"
        // opacity, not visibility: visibility:hidden would also strip the label
        // from the accessibility tree, leaving the buttons unnamed.
        opacity={settled ? 1 : 0}
      >
        {children}
      </chakra.div>
    </chakra.div>
  );
};
