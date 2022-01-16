# Scan Detector

Detect barcode scanner and keyboard input events separately in your web or electronJS application with ease.

### **install**

```
$ npm i scan-detector --save
```

### **Quick usage**

```js
const ScanDetector = require("scan-detector");

let detector = ScanDetector();

detector.attach();

document.addEventListener("scanner", (e) => {
  // handle scan code
});

document.addEventListener("keyboard", (e) => {
  // handle keyboard input
});

detector.detach();
```

### **Options**

```js
let sd = ScanDetector({ element: document, minCodeLength: 4 });
```

| Option          | Type                      | Default  | Description                                     |
| --------------- | ------------------------- | -------- | ----------------------------------------------- |
| element         | html element              | document | html element to attach and listen for inputs    |
| prefix          | array (char codes)        | []       | these characters will be discarded              |
| suffix          | array (char codes)        | [9, 13]  | possible end characters, will be discarded      |
| avgCharTime     | number (ms)               | 30       | average time between each scanner keydown event |
| minCodeLength   | number                    | 6        | min length of scanned code                      |
| customEncoder   | function(number keyCode)  | null     | will be called on each keydown event            |
| onScanFinish    | function(string scanCode) | null     | will be called when scan is finished            |
| preventDefault  | bool                      | false    | prevent default keydown behavior                |
| stopPropagation | bool                      | false    | stops event propagation                         |
| debugMode       | bool                      | false    | logs each keydown event in console              |

### **Methods**

#### **setOptions(options):**

seta detector options.

#### **getOptions():**

returns detector options.

#### **attach():**

attach detector to the element, it will listen
to keydown event in the element.

#### **detach():**

detach detector from element.

### **Example**

```js
const ScanDetector = require("scan-detector");

let input = document.getElementById("text_input");

let detector = ScanDetector({
  element: document,
  avgCharTime: 30,
  minCodeLength: 6,
  customEncoder: (event) => {
    return event.key;
  },
  customDecoder: (code) => {
    return [...code.matchAll(/Alt([0-9]{3})/g)].reduce((t, v) => {
      return (t += String.fromCharCode(v[1].toString()));
    }, "");
  },
});

detector.attach();

document.addEventListener("scanner", (e) => {
  input.value = e.detail;
});

document.addEventListener("keyboard", (e) => {
  console.log(e);
});
```
