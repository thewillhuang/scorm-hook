import { useState, useEffect } from "react";

const scormHook = ({ state: defaultStore, config: cfg }) => {
  const [store, setStore] = useState(defaultStore);

  const defaults = {
    Initialize: () => {
      console.log("initialize called by course");
      return "true";
    },
    Terminate: () => {
      console.log("terminate called by course");
      return "true";
    },
    GetValue: props => {
      console.log("getting value", props);
      return store[props] || "";
    },
    SetValue: (key, value) => {
      console.log("setting value", key, value);
      setStore({ ...store, [key]: value });
      return store[key];
    },
    Commit: () => {
      console.log("course asks for state saving");
    },
    GetLastError: () => {
      console.log("returning last error code");
    },
    GetErrorString: () => {
      console.log("returning error string");
    },
    GetDiagnostic: () => {
      console.log("returning some detail lms error string");
    },
  };

  const config = { ...defaults, ...cfg };

  const SCORMOLD = {
    LMSInitialize: config.Initialize,
    LMSFinish: config.Terminate,
    LMSGetValue: config.GetValue,
    LMSSetValue: config.SetValue,
    LMSCommit: config.Commit,
    LMSGetLastError: config.GetLastError,
    LMSGetErrorString: config.GetErrorString,
    LMSGetDiagnostic: config.GetDiagnostic,
  };

  const scorm2004 = {
    ...config,
  };

  const setupLmsApi = () => {
    global.API = SCORMOLD;
    global.API_1484_11 = scorm2004;
  };
  useEffect(() => {
    setupLmsApi();
  }, []);
  return store;
};

export default scormHook;
