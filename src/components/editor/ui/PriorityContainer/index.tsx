import React, {
  useRef,
  useState,
  useLayoutEffect,
  type HTMLAttributes,
} from "react";
import "./styles.css";

interface PriorityContainerProps extends HTMLAttributes<HTMLDivElement> {
  onOverflowChange?: (hidden: React.ReactNode[]) => void;
}

export function PriorityContainer({
  children,
  onOverflowChange,
  ...props
}: PriorityContainerProps) {
  const wrapper = useRef<HTMLDivElement | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const measurer = useRef<HTMLDivElement | null>(null);

  const [overflowSliceIndex, setOverflowSliceIndex] = useState<
    number | undefined
  >(undefined);

  useLayoutEffect(() => {
    const measure = () => {
      if (!wrapper.current || !measurer.current) return;
      const wrapperWidth = wrapper.current.getBoundingClientRect().width;
      const items = Array.from(measurer.current.children) as HTMLElement[];

      let total = 0;
      let count = 0;
      for (let i = 0; i < items.length; i++) {
        const w = items[i].getBoundingClientRect().width;
        if (total + w <= wrapperWidth) {
          total += w;
          count++;
        } else break;
      }

      setOverflowSliceIndex(count);
      onOverflowChange?.(
        React.Children.toArray(children).slice(overflowSliceIndex)
      );
    };

    measure();
    const observer = new ResizeObserver(() => requestAnimationFrame(measure));

    observer.observe(wrapper.current!);

    return () => observer.disconnect();
  }, [children]);

  const visible = React.Children.toArray(children).slice(0, overflowSliceIndex);

  return (
    <div className="priority-wrapper" ref={wrapper} {...props}>
      <span className="priority-container" ref={container}>
        {visible}
      </span>

      {/* hidden measurer */}
      <span
        ref={measurer}
        className="priority-container priority-container--hidden"
      >
        {children}
      </span>
    </div>
  );
}
