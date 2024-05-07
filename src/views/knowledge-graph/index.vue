<template>
	<div>
	<div class="flex-1">
	  <textarea class="w-full h-full border border-gray-400" v-model="value" />
	</div>
	<svg class="flex-1 svg-container" ref="svgRef" width="var(--svg-width)" height="var(--svg-height)" />

 </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import { Transformer } from 'markmap-lib';
  import { Markmap } from 'markmap-view';
  import { nextTick } from 'vue';
  
  const transformer = new Transformer();
  
  // 数据模型
  const initValue = `---
title: java学习路线
markmap:
  colorFreezeLevel: 2
  color: grey
---

## 基础篇
### 1. Java 语言基础
   - <span style="background-color: yellow;">Java 简介与历史</span>
   - <span style="background-color: Chartreuse;">HelloWorld 程序与开发环境搭建
   - 数据类型与变量
   - 运算符与流程控制（if, switch, for, while）
   - 数组与集合框架
   - 函数（方法）
   - 类与对象
   - 继承与多态
  - <span style="background-color: yellow;">抽象类与接口</span>
   - 异常处理
   - 输入输出流

### 2. 面向对象编程
   - 封装、继承、多态深入理解
   - 设计模式简介（单例、工厂、观察者等）

## 进阶篇
### 3. 高级特性
   - 泛型
   - 枚举与注解
   - Lambda 表达式与函数式接口
   - Stream API
   - 并发编程基础
   - 文件与IO
   - 新特性速览（Java 8+）

### 4. 集合框架深入
  - <span style="background-color: yellow;">List, Set, Map 接口与实现</span>
   - Collection 与 Iterator
   - 并发集合

### 5. JVM 基础
   - JVM 内存模型
   - 类加载机制
   - 字节码与JIT编译
   - GC（垃圾回收）机制

## 实战篇
### 6. Web 开发技术
   - Servlet & JSP
   - Spring Framework
     - IoC & DI
     - AOP
     - MVC
   - RESTful API 设计
   - 数据库连接（JDBC）
   - ORM（Hibernate, MyBatis）

### 7. 框架与工具
   - Spring Boot
   - Spring Cloud
   - Maven & Gradle
   - Unit Testing（JUnit, Mockito）
   - Logging（Log4j, SLF4J）

### 8. 微服务架构
   - 微服务概念与原则
   - Spring Cloud 微服务组件
   - Docker & Kubernetes 基础

## 性能优化与设计
### 9. 性能调优
   - 代码层面优化
   - JVM 参数调优
   - 应用性能监控

### 10. 设计原则与模式
   - SOLID 原则
   - 企业级应用设计模式

## 其他技术拓展
### 11. 大数据技术栈
   - Hadoop
   - Spark
   - Flink

### 12. 安全与并发
   - 安全框架（Spring Security）
   - 并发编程高级主题

### 13. DevOps 相关
   - CI/CD 流程
   - Docker 容器化
   - 云原生应用开发
  `;
  

  const jsonOptions = {
  color: ['#FF69B4', '#87CEFA', '#98FB98', '#FFD700', '#FF4500'], // 自定义颜色列表
};
  

  // 使用ref定义响应式数据
  const value = ref<string>(initValue);
  const svgRef = ref<SVGSVGElement | null>(null);
  let mm: Markmap | null = null;
  
  const updateMarkmap = async () => {
  if (mm && svgRef.value) {
    const { root } = transformer.transform(value.value);
    mm.setData(root);
    mm.fit();

    await nextTick(); // 确保DOM更新完成
    const bbox = svgRef.value.getBBox();

    // 使用CSS变量设置SVG大小
    document.documentElement.style.setProperty('--svg-width', `${bbox.width}px`);
    document.documentElement.style.setProperty('--svg-height', `${bbox.height}px`);

    // 动态设置SVG元素的宽度和高度
    svgRef.value.setAttribute('width', `var(--svg-width)`);
    svgRef.value.setAttribute('height', `var(--svg-height)`);
  }
};


  
  // 监听value变化，自动更新思维导图
  watch(value, () => {
	  updateMarkmap();
  });
  
  // 挂载后初始化思维导图
  onMounted(() => {
	  if (svgRef.value) {
		  mm = Markmap.create(svgRef.value);
		  updateMarkmap(); // 初始化时也调用更新方法
	  }
  });
  </script>

  <style>
  .svg-container {
  --svg-width: 50vw;
  --svg-height: calc(50vh - 2vw); /* 减去上下边距 */
  width: 100vw;
  height: calc(100vh - 4vw); /* 减去上下边距，以确保内容居中 */
  margin-top: 1vw;
  margin-left: 1vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0; /* 添加背景颜色 */
}
</style>