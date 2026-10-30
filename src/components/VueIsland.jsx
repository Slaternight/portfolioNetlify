import { useEffect, useRef } from "react";
import { createApp, h, reactive } from "vue";

/**
 * Mounts a Vue component inside the React tree (micro-frontend "island").
 * Props live in a Vue `reactive` object, so React re-renders flow into the
 * Vue component without remounting it. Vue events arrive as `onXxx` props.
 */
export default function VueIsland({ component, props, className }) {
  const hostRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    stateRef.current = reactive({ ...props });
    const app = createApp({ render: () => h(component, stateRef.current) });
    app.mount(hostRef.current);
    return () => app.unmount();
    // Mount once per component; prop updates are synced by the effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component]);

  useEffect(() => {
    if (stateRef.current) Object.assign(stateRef.current, props);
  }, [props]);

  return <div ref={hostRef} className={className} />;
}
