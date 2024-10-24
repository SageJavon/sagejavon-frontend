import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';

const API_BASE_URL = `https://api.xhpolaris.com/sagejavon/question/recommend`;

interface ReviewResponse {
    data: number;      // 最终设置的评价 (integer)
    code: string;      // 响应码 (string)
    message: string;   // 响应消息 (string)
    resolve: string | null; // 解析结果 (string 或 null)
  }

// 提交问题评价的函数
export async function reviewQuestion(
  exerciseId: number,
  review: number,
  token: string = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6MSwiZGV2aWNlSWQiIiwiZGV2aWNlSWQiOiIiLCJleHAiOjE3MjcyNzI5MDcsImlhdCI6MTcyNDY4MDkwNywidXNlcklkIjoiNjY4NTIzOWQxOGFiZmU4MjNhZjg0NjgwIiwid2VjaGF0VXNlck1ldGEiOnt9fQ.k6HcTJeJjq_mDfT5A6KtKnUbwyQyHwSYUbdqWnQod_e15X0__n-bgyt3WKtAFy2BiCOUVsZKgZl4tE4xGxNjuA'
): Promise<AxiosResponse<ReviewResponse>> {
  // 构建 URLSearchParams 查询参数
  const params = new URLSearchParams({
    exerciseId: exerciseId.toString(),
    review: review.toString(),
  }).toString();

  const config = {
    method: 'get',
    url: `${API_BASE_URL}?${params}`, // 将查询参数拼接到 URL
    headers: {
      'Content-Type': 'application/json',
      'Token': localStorage.getItem('user-token') || '',
    },
  };

  // 使用 axios 发出请求
  return axios(config)
    .then((response: AxiosResponse<ReviewResponse>) => {
      return response; // 返回响应
    })
    .catch((error: AxiosError) => {
      console.error('问题评价提交失败:', error);
      throw error; // 抛出错误以便在调用处处理
    });
}
