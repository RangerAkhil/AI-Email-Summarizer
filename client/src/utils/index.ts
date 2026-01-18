import { useEffect, useRef, useState } from "react";

type DebounceOptions = {
    delay?: number;
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
};

export function useDebouncedValue<T>(
    value: T,
    options: DebounceOptions = {}
) {
    const {
        delay = 400,
        leading = false,
        trailing = true,
        maxWait,
    } = options;

    const [debounced, setDebounced] = useState<T>(value);

    const lastCallTimeRef = useRef<number | null>(null);
    const leadingFiredRef = useRef(false);
    const timerRef = useRef<number | null>(null);
    const maxTimerRef = useRef<number | null>(null);

    useEffect(() => {
        const now = Date.now();

        // leading
        if (leading && !leadingFiredRef.current) {
            setDebounced(value);
            leadingFiredRef.current = true;
            lastCallTimeRef.current = now;
        }

        // clear old timers
        if (timerRef.current) window.clearTimeout(timerRef.current);
        if (maxTimerRef.current) window.clearTimeout(maxTimerRef.current);

        // trailing
        if (trailing) {
            timerRef.current = window.setTimeout(() => {
                setDebounced(value);
                lastCallTimeRef.current = Date.now();
            }, delay);
        }

        // maxWait (force update even if typing never stops)
        if (maxWait != null) {
            const last = lastCallTimeRef.current ?? now;
            const remaining = Math.max(0, maxWait - (now - last));

            maxTimerRef.current = window.setTimeout(() => {
                setDebounced(value);
                lastCallTimeRef.current = Date.now();
            }, remaining);
        }

        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
            if (maxTimerRef.current) window.clearTimeout(maxTimerRef.current);

            // reset leading after user stops typing
            timerRef.current = window.setTimeout(() => {
                leadingFiredRef.current = false;
            }, delay);
        };
    }, [value, delay, leading, trailing, maxWait]);

    return debounced;
}
