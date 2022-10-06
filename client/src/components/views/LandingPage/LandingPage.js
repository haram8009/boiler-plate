import React, { useEffect } from 'react'
import axios from 'axios';

function LandingPage() {
  // 랜딩 페이지에 들어오자마자 이걸 함
  useEffect(()=> {
    axios.get('/api/hello')
    .then(response => console.log(response.data))
  }, []) // 서버로 보냄

  return (
    <div>LandingPage</div>
  )
}

export default LandingPage