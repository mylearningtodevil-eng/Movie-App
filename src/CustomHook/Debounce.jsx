    import { useState, useEffect } from 'react';

    function useDebounce(value, delay) {
      const [debouncedValue, setDebouncedValue] = useState(value);

      useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);

        // Cleanup function to clear the timeout if value or delay changes before the timeout fires
        return () => {
          clearTimeout(handler);
        };
      }, [value, delay]); // Re-run effect if value or delay changes

      return debouncedValue;
    }

    export default useDebounce;