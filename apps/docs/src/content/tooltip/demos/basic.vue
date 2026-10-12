<script setup lang="ts">
import { Tooltip, Button } from '@xui-design/vue';
</script>

<template>
  <div class="demo-row">
    <Tooltip content="上方提示" placement="top">
      <Button>Top</Button>
    </Tooltip>
    <Tooltip content="下方提示" placement="bottom">
      <Button>Bottom</Button>
    </Tooltip>
    <Tooltip content="左侧提示" placement="left">
      <Button>Left</Button>
    </Tooltip>
    <Tooltip content="右侧提示" placement="right">
      <Button>Right</Button>
    </Tooltip>
  </div>
</template>
