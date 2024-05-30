import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'

function smartQueryStream(query: string): Promise<AxiosResponse> {
  const data = {
    query,
    user_id: 'afcbbca8-a62c-4809-930c-4e1962047af0',
  }

  console.log(data)

  const config = {
    method: 'post',
    url: 'http://59.78.194.84:7001/open_kf_api/queries/smart_query_stream',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWZjYmJjYTgtYTYyYy00ODA5LTkzMGMtNGUxOTYyMDQ3YWYwIiwiZXhwIjoxNzE3NjQ5OTIxfQ.DN9iUp0OCBJJoD-e68PqDXfSya3cLQSDDtFHmGQH70o',
    },
    data,
  }

  return axios(config)
    .then((response: AxiosResponse) => {
      return response
    })
    .catch((error: AxiosError) => {
      throw error
    })
}

export { smartQueryStream }
