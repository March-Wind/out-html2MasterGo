import { renderToMasterGo } from "../../../lib/index";
console.clear();

const main = async () => {
  mg.showUI(__html__);
};

main();

// 定义类型：可以是对象、数组、或者其他任意类型
type AnyObject = { [key: string]: any } | any[];

// 判断一个对象是否是符合条件的 bytes 对象
function isBytesObject(obj: AnyObject): boolean {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return false;

  // 检查对象是否所有键均为数字，并且键的值均为合法的字节（0-255）
  const keys = Object.keys(obj);
  return (
    keys.every((key) => !isNaN(Number(key)) && Number(key) >= 0) &&
    keys.every((key) => typeof obj[key] === "number" && obj[key] >= 0 && obj[key] <= 255)
  );
}

// 递归将对象中的 bytes 对象转换为 Uint8Array
function convertBytesToUint8Array(obj: AnyObject): AnyObject | Uint8Array {
  if (Array.isArray(obj)) {
    // 如果是数组，递归转换数组中的每一个元素
    return obj.map((element) => convertBytesToUint8Array(element));
  } else if (typeof obj === "object" && obj !== null) {
    if (isBytesObject(obj)) {
      // 如果是符合条件的 bytes 对象，转换为 Uint8Array
      return new Uint8Array(Object.values(obj));
    } else {
      // 如果是普通对象，递归转换每一个键值对
      const result: { [key: string]: AnyObject | Uint8Array } = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          result[key] = convertBytesToUint8Array(obj[key]);
        }
      }
      return result;
    }
  }

  // 如果是其他类型（例如字符串、数字），直接返回原值
  return obj;
}

// mg.on的callback不能用async修饰
mg.on("drop", (evt: DropEvent) => {
  const { absoluteX, absoluteY, items } = evt;
  try {
    const code = convertBytesToUint8Array(JSON.parse(items));
    console.log("code", code);
    renderToMasterGo(code).then((node) => {
      // setTimeout(() => {
      //   if (node) {
      //     node.x = absoluteX;
      //     node.y = absoluteY;
      //   }
      //   console.log("生成成功", node!.x);
      // }, 100);
    });
  } catch (error) {
    console.log(22222, error);
  }

  // window.navigator.clipboard
  //   .readText()
  //   .then((text) => {
  //     console.log("从剪贴板获取的文本:", text);

  //     // renderToMasterGo(text).then((node) => {
  //     //   // setTimeout(() => {
  //     //   //   if (node) {
  //     //   //     node.x = absoluteX;
  //     //   //     node.y = absoluteY;
  //     //   //   }
  //     //   //   console.log("生成成功", node!.x);
  //     //   // }, 100);
  //     // });
  //   })
  //   .catch((err) => {
  //     console.log(222, err);
  //   });
  console.log(1234, items);
});
