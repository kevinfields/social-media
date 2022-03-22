import React from 'react'

const Comment = (props) => {
  return (
    <section className='comment'>
      <p className='comment-text'>{props.text}</p>
      <p className='comment-poster'> - {props.poster}</p>
      <p className='comment-time'>{props.time}</p>
    </section>
  )
}

export default Comment