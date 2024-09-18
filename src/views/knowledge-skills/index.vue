<template>
	<!-- 知识点掌握图 -->
	<div style="margin: 20px 0 20px 20px; width: 100%; height: 100%;">
		<!-- <input v-model="sListInput" placeholder="请输入知识点ID[1-123]（英文逗号分隔，例: 25,109,84）" style="width: 30%;" clearable />
		<button type="primary" icon="el-icon-search" style="margin-left: 5px" @click="load">搜索知识图谱</button> -->
		<div ref="chartRef" id="table" class="myChart"></div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { data, links } from './chartData';
import { debounce } from '@/utils/functions/debounce';

const chartInstance = ref<echarts.EChartsType | null>(null);
const chartRef = ref(null);

// echarts配置
const chartOption = {
	title: {
		text: '知识图谱'
	},
	tooltip: {},
	toolbox: {
		show: true,
		feature: {
			mark: { show: true },
			restore: { show: true },
			saveAsImage: { show: true },
			dataView: {},
			dataZoom: {},
		}
	},
	series: [
		{
			type: 'graph',
			layout: 'force',
			symbolSize: 100,
			roam: true,
			edgeSymbol: ['circle', 'arrow'],
			edgeSymbolSize: [2, 5],
			force: {
				repulsion: 1000,
				edgeLength: [10, 300]
			},
			draggable: true,
			lineStyle: {
				width: 2,
				color: 'source',
				curveness: 0.3
			},
			emphasis: {
				focus: 'adjacency',
				lineStyle: {
					width: 5
				}
			},
			label: {
				normal: {
					show: true,
					textStyle: {}
				}
			},
			data: data,
			links: links,
		}
	]
};

onMounted(() => {
	chartInstance.value = echarts.init(chartRef.value);	// 初始化echarts实例
	setTimeout(() => {
		chartInstance.value?.setOption(chartOption);	// 配置echarts实例
	}, 0);
});

// 当窗口大小改变时，重新调整图表大小
window.onresize = debounce(() => {
	chartInstance.value?.resize();
}, 100);

// 由于chartInstance和chartRef在初始化之后不会再改变，所以不需要watchEffect监听
// watchEffect(() => {
// 	if (chartInstance.value && chartRef.value) {
// 		setChart();
// 	}
// });

</script>

<style scoped>
/* 你的样式 */
/*自定义图表*/
.myChart {
	position: absolute;
	/* 将图表定位到页面的左上角 */
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	margin: 0;
	/* 移除外边距 */
	width: 100%;
	/* 设置宽度为100% */
	height: 100%;
	/* 设置高度为100% */
}

/*自定义图表*/
.myLink {
	text-decoration: none;
}
</style>