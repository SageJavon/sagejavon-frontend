<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { Transformer } from 'markmap-lib'
import { Markmap } from 'markmap-view'

const transformer = new Transformer()

// 数据模型
const initValue = `---
title: java学习路线
markmap:
  colorFreezeLevel: 2
  color: grey
---

## <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">基础篇</div>
### <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">1. Java 语言基础</div>
   - <div style="border: 1px solid; background-color:red; border-radius: 5px; padding: 5px;">Java 简介与历史</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">HelloWorld 程序与开发环境搭建</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">数据类型与变量</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">运算符与流程控制（if, switch, for, while）</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">数组与集合框架</div>
   - <div style="border: 1px solid; background-color: green; border-radius: 5px; padding: 5px;">函数（方法）</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">类与对象</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">继承与多态</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">抽象类与接口</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">异常处理</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">输入输出流</div>

### <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">2. 面向对象编程</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">封装、继承、多态深入理解</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">设计模式简介（单例、工厂、观察者等）</div>

## <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">进阶篇</div>
### <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">3. 高级特性</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">泛型</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">枚举与注解</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">Lambda 表达式与函数式接口</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">Stream API</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">并发编程基础</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">文件与IO</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">新特性速览（Java 8+）</div>

### <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">4. 集合框架深入</div>
  - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">List, Set, Map 接口与实现</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">Collection 与 Iterator</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">并发集合</div>

### <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">5. JVM 基础</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">JVM 内存模型</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">类加载机制</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">字节码与JIT编译</div>
   - <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">GC（垃圾回收）机制</div>

## <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">实战篇</div>
### <div style="border: 1px solid; background-color: lightgrey; border-radius: 5px; padding: 5px;">6. Web 开发技术</div>


  `

const jsonOptions = {
  color: ['#FF69B4', '#87CEFA', '#98FB98', '#FFD700', '#FF4500'], // 自定义颜色列表
}

// 使用ref定义响应式数据
const value = ref<string>(initValue)
const svgRef = ref<SVGSVGElement | null>(null)
let mm: Markmap | null = null

const updateMarkmap = async () => {
  if (mm && svgRef.value) {
    const { root } = transformer.transform(value.value)
    mm.setData(root)
    mm.fit()

    await nextTick() // 确保DOM更新完成
    const bbox = svgRef.value.getBBox()

    // 使用CSS变量设置SVG大小
    document.documentElement.style.setProperty('--svg-width', `${bbox.width}px`)
    document.documentElement.style.setProperty('--svg-height', `${bbox.height}px`)

    // 动态设置SVG元素的宽度和高度
    svgRef.value.setAttribute('width', 'var(--svg-width)')
    svgRef.value.setAttribute('height', 'var(--svg-height)')
  }
}

// 监听value变化，自动更新思维导图
watch(value, () => {
	  updateMarkmap()
})

// 挂载后初始化思维导图
onMounted(() => {
	  if (svgRef.value) {
		  mm = Markmap.create(svgRef.value)
		  updateMarkmap() // 初始化时也调用更新方法
	  }
})
</script>

<template>
  <div class="h-full w-full">
    <!-- <div class="flex-1">
      <textarea v-model="value" class="w-full h-full border" />
    </div> -->
    <svg ref="svgRef" class="flex-1 svg-container" width="100%" height="100%" />
  </div>
</template>

  <style>
  .svg-container {
  --svg-height: calc(50vh - 2vw); /* 减去上下边距 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #dfdfdf; /* 添加背景颜色 */
}
</style>
