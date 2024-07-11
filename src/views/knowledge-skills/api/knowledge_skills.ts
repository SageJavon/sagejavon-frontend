import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'

function knowledgeSkills(sList:string): Promise<AxiosResponse> {
  // const data = {
  //   nickname: userInfo.nickname,
  //   portrait: userInfo.portrait,
  //   gender: userInfo.gender === 'female' ? 0 : 1,
  // }

  const config = {
    method: 'get',
    url: 'http://localhost:5000/kt/skillGraph',
    headers: {
      'X-Xh-Env': 'prod',
      'X-Xh-Lane': '',
      'Content-Type': 'application/json',
      'token': localStorage.getItem('user-token'),
	  },
	params: {
		sList: sList
	}
  }

  return axios(config)
    .then((response: AxiosResponse) => {
      return response
    })
    .catch((error: AxiosError) => {
      throw error
    })
}

export { knowledgeSkills }
