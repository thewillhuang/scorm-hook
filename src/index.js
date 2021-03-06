import { useEffect, useState } from "react";
import { includes } from "ramda";

const useScormHook = (
  { state: startingState = {}, config: cfg = {} } = {
    state: {},
    config: {},
  }
) => {
  const [state, setState] = useState(startingState);
  const defaultConfig = {
    Initialize: () => {
      console.log("initialize called by course");
      return "true";
    },
    Terminate: () => {
      console.log("terminate called by course");
      return "true";
    },
    GetValue: key => {
      console.log("getting value", key);
      return state[key] || "";
    },
    SetValue: (key, value) => {
      console.log("setting value", key, value);
      setState({ ...state, [key]: value });
      if (
        includes(key, [
          "cmi.completion_status",
          "cmi.success_status",
          "cmi.core.lesson_status",
        ])
      ) {
        setState({ ...state, courseCompleted: value });
      }
      if (includes(key, ["cmi.score.scaled", "cmi.core.score.raw"])) {
        setState({ ...state, courseScore: value });
      }
      if (includes(key, ["cmi.session_time", "cmi.core.session_time"])) {
        setState({ ...state, courseTimeSpent: value });
      }
      if (includes(key, ["cmi.location", "cmi.core.lesson_location"])) {
        setState({ ...state, courseBookmark: value });
      }
      if (includes(key, ["cmi.exit", "cmi.core.exit"])) {
        setState({ ...state, courseExitMethod: value });
      }
      return state[key];
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

  const config = { ...defaultConfig, ...cfg };

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

  const SCORM2004 = {
    ...config,
  };

  useEffect(() => {
    const setupLmsApi = () => {
      global.API = SCORMOLD;
      global.API_1484_11 = SCORM2004;
    };
    setupLmsApi();
    return () => {
      delete global.API;
      delete global.API_1484_11;
    };
  }, []);

  return [state, setState];
};

export default useScormHook;
