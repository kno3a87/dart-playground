  let buildArgsList;

// `modulePromise` is a promise to the `WebAssembly.module` object to be
//   instantiated.
// `importObjectPromise` is a promise to an object that contains any additional
//   imports needed by the module that aren't provided by the standard runtime.
//   The fields on this object will be merged into the importObject with which
//   the module will be instantiated.
// This function returns a promise to the instantiated module.
export const instantiate = async (modulePromise, importObjectPromise) => {
    let dartInstance;

      function stringFromDartString(string) {
        const totalLength = dartInstance.exports.$stringLength(string);
        let result = '';
        let index = 0;
        while (index < totalLength) {
          let chunkLength = Math.min(totalLength - index, 0xFFFF);
          const array = new Array(chunkLength);
          for (let i = 0; i < chunkLength; i++) {
              array[i] = dartInstance.exports.$stringRead(string, index++);
          }
          result += String.fromCharCode(...array);
        }
        return result;
    }

    function stringToDartString(string) {
        const length = string.length;
        let range = 0;
        for (let i = 0; i < length; i++) {
            range |= string.codePointAt(i);
        }
        if (range < 256) {
            const dartString = dartInstance.exports.$stringAllocate1(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite1(dartString, i, string.codePointAt(i));
            }
            return dartString;
        } else {
            const dartString = dartInstance.exports.$stringAllocate2(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite2(dartString, i, string.charCodeAt(i));
            }
            return dartString;
        }
    }

      // Converts a Dart List to a JS array. Any Dart objects will be converted, but
    // this will be cheap for JSValues.
    function arrayFromDartList(constructor, list) {
        const length = dartInstance.exports.$listLength(list);
        const array = new constructor(length);
        for (let i = 0; i < length; i++) {
            array[i] = dartInstance.exports.$listRead(list, i);
        }
        return array;
    }

    buildArgsList = function(list) {
        const dartList = dartInstance.exports.$makeStringList();
        for (let i = 0; i < list.length; i++) {
            dartInstance.exports.$listAdd(dartList, stringToDartString(list[i]));
        }
        return dartList;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
        wrapped.dartFunction = dartFunction;
        wrapped[jsWrappedDartFunctionSymbol] = true;
        return wrapped;
    }

    if (WebAssembly.String === undefined) {
        console.log("WebAssembly.String is undefined, adding polyfill");
        WebAssembly.String = {
            "charCodeAt": (s, i) => s.charCodeAt(i),
            "compare": (s1, s2) => {
                if (s1 < s2) return -1;
                if (s1 > s2) return 1;
                return 0;
            },
            "concat": (s1, s2) => s1 + s2,
            "equals": (s1, s2) => s1 === s2,
            "fromCharCode": (i) => String.fromCharCode(i),
            "length": (s) => s.length,
            "substring": (s, a, b) => s.substring(a, b),
        };
    }

    // Imports
    const dart2wasm = {

  _47: x0 => globalThis.document.getElementById(x0),
_48: x0 => x0.data,
_51: f => finalizeWrapper(f,x0 => dartInstance.exports._51(f,x0)),
_52: (x0,x1) => globalThis.window.addEventListener(x0,x1),
_77: s => stringToDartString(JSON.stringify(stringFromDartString(s))),
_78: s => console.log(stringFromDartString(s)),
_181: o => o === undefined,
_182: o => typeof o === 'boolean',
_183: o => typeof o === 'number',
_185: o => typeof o === 'string',
_188: o => o instanceof Int8Array,
_189: o => o instanceof Uint8Array,
_190: o => o instanceof Uint8ClampedArray,
_191: o => o instanceof Int16Array,
_192: o => o instanceof Uint16Array,
_193: o => o instanceof Int32Array,
_194: o => o instanceof Uint32Array,
_195: o => o instanceof Float32Array,
_196: o => o instanceof Float64Array,
_197: o => o instanceof ArrayBuffer,
_198: o => o instanceof DataView,
_199: o => o instanceof Array,
_200: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
_203: o => o instanceof RegExp,
_204: (l, r) => l === r,
_205: o => o,
_206: o => o,
_207: o => o,
_208: b => !!b,
_209: o => o.length,
_212: (o, i) => o[i],
_213: f => f.dartFunction,
_214: l => arrayFromDartList(Int8Array, l),
_215: l => arrayFromDartList(Uint8Array, l),
_216: l => arrayFromDartList(Uint8ClampedArray, l),
_217: l => arrayFromDartList(Int16Array, l),
_218: l => arrayFromDartList(Uint16Array, l),
_219: l => arrayFromDartList(Int32Array, l),
_220: l => arrayFromDartList(Uint32Array, l),
_221: l => arrayFromDartList(Float32Array, l),
_222: l => arrayFromDartList(Float64Array, l),
_223: (data, length) => {
          const view = new DataView(new ArrayBuffer(length));
          for (let i = 0; i < length; i++) {
              view.setUint8(i, dartInstance.exports.$byteDataGetUint8(data, i));
          }
          return view;
        },
_224: l => arrayFromDartList(Array, l),
_225: stringFromDartString,
_226: stringToDartString,
_232: (o, p) => p in o,
_233: (o, p) => o[p],
_170: (s, m) => {
          try {
            return new RegExp(s, m);
          } catch (e) {
            return String(e);
          }
        },
_171: (x0,x1) => x0.exec(x1),
_172: (x0,x1) => x0.test(x1),
_173: (x0,x1) => x0.exec(x1),
_174: (x0,x1) => x0.exec(x1),
_175: x0 => x0.pop(),
_176: x0 => globalThis.Object.keys(x0),
_178: (x0,x1) => x0[x1],
_180: x0 => x0.length,
_229: l => new Array(l),
_237: o => String(o),
_241: x0 => x0.input,
_242: x0 => x0.index,
_243: x0 => x0.groups,
_244: x0 => x0.length,
_246: (x0,x1) => x0[x1],
_250: x0 => x0.flags,
_251: x0 => x0.multiline,
_252: x0 => x0.ignoreCase,
_253: x0 => x0.unicode,
_254: x0 => x0.dotAll,
_255: (x0,x1) => x0.lastIndex = x1,
_130: Object.is,
_132: WebAssembly.String.concat,
_140: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
_142: o => o.buffer,
_90: (a, i) => a.push(i),
_91: (a, i) => a.splice(i, 1)[0],
_93: (a, l) => a.length = l,
_94: a => a.pop(),
_95: (a, i) => a.splice(i, 1),
_96: (a, s) => a.join(s),
_97: (a, s) => a.join(s),
_98: (a, s, e) => a.slice(s, e),
_100: (a, b) => a == b ? 0 : (a > b ? 1 : -1),
_101: a => a.length,
_102: (a, l) => a.length = l,
_103: (a, i) => a[i],
_104: (a, i, v) => a[i] = v,
_105: (a, t) => a.concat(t),
_106: a => a.join(''),
_107: (o, a, b) => o.replace(a, b),
_108: (o, p, r) => o.split(p).join(r),
_109: (s, t) => s.split(t),
_110: s => s.toLowerCase(),
_111: s => s.toUpperCase(),
_112: s => s.trim(),
_113: s => s.trimLeft(),
_114: s => s.trimRight(),
_115: (s, n) => s.repeat(n),
_116: (s, p, i) => s.indexOf(p, i),
_117: (s, p, i) => s.lastIndexOf(p, i),
_118: (o, offsetInBytes, lengthInBytes) => {
      var dst = new ArrayBuffer(lengthInBytes);
      new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
      return new DataView(dst);
    },
_119: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
_120: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
_121: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
_122: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
_123: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
_124: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
_125: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
_128: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
_129: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
_131: WebAssembly.String.charCodeAt,
_133: WebAssembly.String.substring,
_134: WebAssembly.String.length,
_135: WebAssembly.String.equals,
_136: WebAssembly.String.compare,
_137: WebAssembly.String.fromCharCode,
_141: o => o.byteLength,
_143: o => o.byteOffset,
_144: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
_145: (b, o) => new DataView(b, o),
_146: (b, o, l) => new DataView(b, o, l),
_147: Function.prototype.call.bind(DataView.prototype.getUint8),
_148: Function.prototype.call.bind(DataView.prototype.setUint8),
_149: Function.prototype.call.bind(DataView.prototype.getInt8),
_150: Function.prototype.call.bind(DataView.prototype.setInt8),
_151: Function.prototype.call.bind(DataView.prototype.getUint16),
_152: Function.prototype.call.bind(DataView.prototype.setUint16),
_153: Function.prototype.call.bind(DataView.prototype.getInt16),
_154: Function.prototype.call.bind(DataView.prototype.setInt16),
_155: Function.prototype.call.bind(DataView.prototype.getUint32),
_156: Function.prototype.call.bind(DataView.prototype.setUint32),
_157: Function.prototype.call.bind(DataView.prototype.getInt32),
_158: Function.prototype.call.bind(DataView.prototype.setInt32),
_159: Function.prototype.call.bind(DataView.prototype.getBigUint64),
_160: Function.prototype.call.bind(DataView.prototype.setBigUint64),
_161: Function.prototype.call.bind(DataView.prototype.getBigInt64),
_162: Function.prototype.call.bind(DataView.prototype.setBigInt64),
_163: Function.prototype.call.bind(DataView.prototype.getFloat32),
_164: Function.prototype.call.bind(DataView.prototype.setFloat32),
_165: Function.prototype.call.bind(DataView.prototype.getFloat64),
_166: Function.prototype.call.bind(DataView.prototype.setFloat64),
_84: (ms, c) =>
              setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
_85: (handle) => clearTimeout(handle),
_86: (ms, c) =>
          setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
_87: (handle) => clearInterval(handle),
_89: () => Date.now(),
_88: (c) =>
              queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
_257: (o, p) => o[p],
_167: s => stringToDartString(stringFromDartString(s).toUpperCase()),
_168: s => stringToDartString(stringFromDartString(s).toLowerCase()),
_53: v => stringToDartString(v.toString()),
_64: Date.now,
_66: s => new Date(s * 1000).getTimezoneOffset() * 60 ,
_67: s => {
      const jsSource = stringFromDartString(s);
      if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(jsSource)) {
        return NaN;
      }
      return parseFloat(jsSource);
    },
_68: () => {
          let stackString = new Error().stack.toString();
          let frames = stackString.split('\n');
          let drop = 2;
          if (frames[0] === 'Error') {
              drop += 1;
          }
          return frames.slice(drop).join('\n');
        },
_69: () => typeof dartUseDateNowForTicks !== "undefined",
_70: () => 1000 * performance.now(),
_71: () => Date.now(),
_72: () => {
      // On browsers return `globalThis.location.href`
      if (globalThis.location != null) {
        return stringToDartString(globalThis.location.href);
      }
      return null;
    },
_73: () => {
        return typeof process != undefined &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
_74: () => new WeakMap(),
_75: (map, o) => map.get(o),
_76: (map, o, v) => map.set(o, v),
_42: (decoder, codeUnits) => decoder.decode(codeUnits),
_43: () => new TextDecoder("utf-8", {fatal: true}),
_44: () => new TextDecoder("utf-8", {fatal: false})
      };

    const baseImports = {
        dart2wasm: dart2wasm,

  
          Math: Math,
        Date: Date,
        Object: Object,
        Array: Array,
        Reflect: Reflect,
    };
    dartInstance = await WebAssembly.instantiate(await modulePromise, {
        ...baseImports,
        ...(await importObjectPromise),
    });

    return dartInstance;
}

// Call the main function for the instantiated module
// `moduleInstance` is the instantiated dart2wasm module
// `args` are any arguments that should be passed into the main function.
export const invoke = (moduleInstance, ...args) => {
    const dartMain = moduleInstance.exports.$getMain();
    const dartArgs = buildArgsList(args);
    moduleInstance.exports.$invokeMain(dartMain, dartArgs);
}

