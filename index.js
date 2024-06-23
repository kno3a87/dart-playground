import { instantiate, invoke } from "./main.mjs";

// Override console.log to display messages in the DOM
const originalConsoleLog = console.log;
console.log = function (message) {
  originalConsoleLog(message); // Keep original behavior
  document.getElementById("output").innerText += message + "\n";
};

invoke(
  await instantiate(
    WebAssembly.compileStreaming(fetch(new URL("main.wasm", import.meta.url)))
  )
);
