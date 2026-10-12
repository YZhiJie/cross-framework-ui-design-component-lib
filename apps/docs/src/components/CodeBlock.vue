<script setup lang="ts">
/**
 * 代码块：Prism 语法高亮 + 一键复制
 * 支持 vue（SFC 按 markup 高亮）/ tsx（typescript）/ bash 三种语言
 */
import { computed, ref } from 'vue';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import { useUiMessages } from '../i18n/ui-messages';

const ui = useUiMessages();

type CodeLang = 'vue' | 'react' | 'bash';

const props = defineProps<{ code: string; lang: CodeLang }>();

const copied = ref(false);
let copyTimer: ReturnType<typeof setTimeout> | undefined;

const langLabel: Record<CodeLang, string> = {
  vue: 'Vue',
  react: 'React TSX',
  bash: 'Shell',
};

const highlighted = computed(() => {
  const grammarMap: Record<CodeLang, Prism.Grammar | undefined> = {
    vue: Prism.languages.markup,
    react: Prism.languages.typescript,
    bash: Prism.languages.bash,
  };
  const grammar = grammarMap[props.lang];
  if (!grammar) return props.code;
  return Prism.highlight(props.code, grammar, props.lang);
});

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied.value = false;
    }, 1500);
  } catch {
    // 剪贴板不可用（非安全上下文 / 用户拒绝授权）时静默
  }
};
</script>

<template>
  <div class="code-block">
    <div class="code-block__bar">
      <span class="code-block__lang">{{ langLabel[lang] }}</span>
      <button type="button" class="code-block__copy" @click="copyCode">
        {{ copied ? ui.code.copied : ui.code.copy }}
      </button>
    </div>
    <pre class="code-block__pre"><code
        class="code-block__code"
        :class="`language-${lang}`"
        v-html="highlighted"
      ></code></pre>
  </div>
</template>
