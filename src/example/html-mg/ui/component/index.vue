<template>
  <div class="wrapper">
    <div class="compo">
      <slot name="compo"></slot>
    </div>
    <!-- 新增的 input 输入框 -->
    <input v-model="inputValue" type="text" placeholder="Enter something" style="margin-top: 20px" />

    <Button style="margin-top: 40px" @click="onClickAction">Drag or click this</Button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, onMounted } from "vue";
import { Button } from "ant-design-vue";
import { htmlToMG, postProcess } from "@mastergo/html-mastergo";
// 定义 props
const { onConvert, index } = defineProps({
  onConvert: {
    type: Function,
    required: true,
  },
  index: {
    type: Number,
  },
});

// 使用 ref 来创建响应式的 input 值
const inputValue = ref("");

onMounted(() => {});

// 点击按钮时，输出 input 框的值并调用 onConvert
const onClickAction = () => {
  console.log(inputValue.value); // 输出 input 框的值
  // onConvert(index);
  parent.postMessage(
    {
      pluginDrop: {
        clientX: 300,
        clientY: 300,
        items: inputValue.value,
      },
    },
    "*"
  );
  // postProcess(JSON.parse(inputValue.value)).then((json) => {
  //   console.log("json:", json);
  //   parent.postMessage(
  //     {
  //       pluginDrop: {
  //         clientX: 300,
  //         clientY: 300,
  //         items: JSON.stringify(json),
  //       },
  //     },
  //     "*"
  //   );
  // });
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  min-height: 60px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  .compo {
    padding: 2px;
    border: 1px solid #00b578;
    border-radius: 6px;
  }
}

.wrapper + .wrapper {
  border-top: 1px solid #f5f5f5;
}
</style>
