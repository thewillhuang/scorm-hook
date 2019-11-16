### usage

```js
import React from "react";
import scormHook from "@thewillhuang/scorm-hook";

const LMS = () => {
  const state = scormHook();
  console.log({ state });
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
