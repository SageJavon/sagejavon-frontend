import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';

const API_BASE_URL = `https://api.xhpolaris.com/sagejavon/question/recommend`;

interface ReviewResponse {
    data: number;      // 评价
    code: string;      // 响应码 
    message: string;   // 响应消息 
    resolve: string | null; // 解析结果 
  }

//提交问题评价
export async function reviewQuestion(
  exerciseId: number,
  review: number,
  token: string = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6MSwiZGV2aWNlSWQiIiwiZGV2aWNlSWQiOiIiLCJleHAiOjE3MjcyNzI5MDcsImlhdCI6MTcyNDY4MDkwNywidXNlcklkIjoiNjY4NTIzOWQxOGFiZmU4MjNhZjg0NjgwIiwid2VjaGF0VXNlck1ldGEiOnt9fQ.k6HcTJeJjq_mDfT5A6KtKnUbwyQyHwSYUbdqWnQod_e15X0__n-bgyt3WKtAFy2BiCOUVsZKgZl4tE4xGxNjuA'
): Promise<AxiosResponse<ReviewResponse>> {
  const params = new URLSearchParams({
    exerciseId: exerciseId.toString(),
    review: review.toString(),
  }).toString();

  const config = {
    method: 'get',
    url: `${API_BASE_URL}?${params}`, 
    headers: {
      'Content-Type': 'application/json',
      'Token': localStorage.getItem('user-token') || '',
    },
  };

  return axios(config)
    .then((response: AxiosResponse<ReviewResponse>) => {
      return response; 
    })
    .catch((error: AxiosError) => {
      console.error('问题评价提交失败:', error);
      throw error; 
    });
}
