import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'

function questionRecommend(num: string): Promise<AxiosResponse> {
  // const data = {
  //   nickname: userInfo.nickname,
  //   portrait: userInfo.portrait,
  //   gender: userInfo.gender === 'female' ? 0 : 1,
  // }

  const params = new URLSearchParams({
    questionNum: num,
    difficultyOrder:0,
  }).toString();

  const config = {
    method: 'get',
    url: `https://api.xhpolaris.com/sagejavon/question/recommend?${params}`,
    headers: {
      'X-Xh-Env': 'prod',
      'X-Xh-Lane': '',
      'Content-Type': 'application/json',
      'token': localStorage.getItem('user-token') || '',
    },
  }


  return axios(config)
    .then((response: AxiosResponse) => {
      return response
    })
    .catch((error: AxiosError) => {
      throw error
    })
}

export { questionRecommend }
