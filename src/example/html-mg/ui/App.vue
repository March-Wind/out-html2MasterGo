<template>
  <div class="container" id="dropContent">
    <CompoWrapper v-for="({ component, content, props }, idx) in compoList" :onConvert="onConvert" :index="idx">
      <template v-slot:compo>
        <component :id="`dragElement-${idx}`" :is="component" :="props" draggable="true" ref="refs">
          {{ content + "123" }}
        </component>
      </template>
    </CompoWrapper>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { ref, shallowReadonly } from "vue";
import CompoWrapper from "./component/index.vue";

import { Button, Result, Progress } from "ant-design-vue";
import Breadcrumb from "./component/breadcrumb.vue";
import Menu from "./component/menu.vue";
import PageHeader from "./component/pageHeader.vue";
import Calendar from "./component/calendar.vue";
import Table from "./component/table.vue";
import ImageView from "./component/image.vue";

import "ant-design-vue/es/menu/style/css";
import "ant-design-vue/es/button/style/css";
import "ant-design-vue/es/result/style/css";
import "ant-design-vue/es/progress/style/css";
import "element-plus/es/components/image/style/css";

import { htmlToMG, postProcess } from "../../../lib";

const refs = ref(null);

const compoList = shallowReadonly([
  {
    component: Button,
    content: "This a button",
    props: {
      type: "primary",
      dragable: true,
    },
  },
  {
    component: Result,
    props: {
      status: "success",
      title: "Successfully Purchased Cloud Server ECS!",
      subTitle: "Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait.",
    },
  },
  {
    component: Progress,
    props: {
      type: "circle",
      percent: 75,
    },
  },
  {
    component: Breadcrumb,
  },
  {
    component: Menu,
  },
  {
    component: PageHeader,
  },
  {
    component: Calendar,
  },
  {
    component: Table,
  },
  {
    component: ImageView,
  },
  {
    component: "div",
    content: "This is a div",
    props: {
      style: "background-color: red; display: flex; align-items: center; justify-content: center; padding: 10px;",
    },
  },
]);

const getConvertedResult = async (element: HTMLElement) => {
  const result = await htmlToMG(element, { absoluteBounds: false });
  return await postProcess(result!);
};

/**
 * post message to topWindow and listen to onDrop event.
 */
const postDropEvent = async (evt: DragEvent) => {
  try {
    const result = await getConvertedResult(evt.target as HTMLElement);
    console.log("succeed convert", result);
    const { clientX, clientY } = evt;
    console.log("client: ", clientX);
    window.parent.postMessage(
      {
        pluginDrop: {
          clientX,
          clientY,
          items: result,
        },
      },
      "*"
    );
  } catch (error) {
    console.error("failed to convert", error);
  }
};

const onDragEnd = (evt: DragEvent) => {
  if (evt?.view?.length === 0) {
    // It doesnt count if element droped in plugin window.
    return;
  }
  postDropEvent(evt);
};

/**
 * post to plugin directly, we use central position of the window
 */
const onConvert = async (idx: number) => {
  try {
    // const element = document.getElementById(`dragElement-${idx}`)
    // const result = await getConvertedResult(element as HTMLElement)
    // console.log('succeed convert', JSON.stringify(result))

    window.navigator.clipboard
      .readText()
      .then((text) => {
        console.log("从剪贴板获取的文本:", text);

        // renderToMasterGo(text).then((node) => {
        //   // setTimeout(() => {
        //   //   if (node) {
        //   //     node.x = absoluteX;
        //   //     node.y = absoluteY;
        //   //   }
        //   //   console.log("生成成功", node!.x);
        //   // }, 100);
        // });
        parent.postMessage(
          {
            pluginDrop: {
              clientX: 300,
              clientY: 300,
              items: text,
            },
          },
          "*"
        );
      })
      .catch((err) => {
        console.log(222, err);
      });
  } catch (error) {
    console.error("failed to convert", error);
  }
};

onMounted(() => {
  const node = document.getElementById("dropContent");
  node?.addEventListener("dragend", onDragEnd);
});

onUnmounted(() => {
  const node = document.getElementById("dropContent");
  node?.removeEventListener("dragend", onDragEnd);
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
</style>
