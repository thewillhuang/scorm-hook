### usage

```js
import React from "react";
import useScormHook from "@thewillhuang/scorm-hook";

const LMS = () => {
  const [state, setState] = useScormHook({
    state: {},
    config: {},
  }); // starting state as state, config is an object with methods matching SCORM2004 standards methods visit https://scorm.com/scorm-explained/technical-scorm/run-time/ for more details
  console.log({ state });
  useEffect(() => {
    uploadToServer(state);
  }, [state]);
  return (
    <div>
      <button
        onCLick={() => {
          window.open(url);
        }}
      >
        {"open course"}
      </button>
    </div>
  );
};
```
