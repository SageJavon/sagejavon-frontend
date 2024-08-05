<template>
    <div class="container1">
		<div class="box1">
			<div class="greeting">
				xxx,早上好！🥰
			</div>
			<div class="recommend">今日为您推荐共计 x 道题目，您已完成 x 道。😗继续加油😙</div>
		</div>
		<div class="box2">
			<div class="flushed" @click="changeQuestion">
				<img src="./images/flush.png" alt="" style="margin: 20px auto;" width="50px" height="50px">
				<div class="flushed-text">
					不喜欢？换一批吧！
				</div>
			</div>
			
		</div>
	</div>		
</template>

<script setup lang="ts">
import { ref } from 'vue';

const git = ref(0);

function changeQuestion() {
	console.log('换一批题');
}

</script>

<style scoped>
.container1 {
	display: flex;
	height: 100%;
	width: 50%;
	margin:20px;

}

.box1 {
	border-collapse: collapse;
	background-color: #ffffff;
	box-shadow: 4px 4px 16px 0px #00000014;
	border-radius: 10px;
	width: 75%;
	letter-spacing: 1px;
	margin-left: 2%;
}

.box2 {
	border-collapse: collapse;
	background-color: #ffffff;
	box-shadow: 4px 4px 16px 0px #00000014;
	border-radius: 10px;
	margin-left: 30px;
	width: 25%;
	letter-spacing: 1px;
}


.flushed-text {
	text-align: center;
	font-size: 15px;
	margin-top: -5px;
	font-weight: bold;
	padding-left: 8px;
}

.greeting {
	font-size: 25px;
	font-weight: bold;
	margin-top: 10px;
	margin-left: 20px;
}

.recommend {
	font-size: 15px;
	margin-top: 20px;
	padding:0 20px;
	font-weight: 500;	
}
</style>