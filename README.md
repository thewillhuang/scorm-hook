### usage

```js
import React from "react";
import scormHook from "@thewillhuang/scorm-hook";

const LMS = () => {
  const state = scormHook({}); // default state as first param, object with methods matching SCORM2004 standards optional
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
