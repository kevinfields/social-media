import React, {useEffect, useState} from 'react'

const Loading = () => {

  const loadingMessages = ['Loading   ', 'Loading.  ', 'Loading.. ', 'Loading...'];
  const [count, setCount] = useState(0);
  const mess = loadingMessages[count % 4];

  useEffect(() =>  {
    setTimeout(() => {
      setCount(count + 1);
    }, 200)
  }, [count])
  return (
    <div className='loading-screen'>
      <h2>{mess}</h2>
    </div>
  )
}

export default Loading