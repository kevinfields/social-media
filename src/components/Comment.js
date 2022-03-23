import React from 'react'
import formatTime from '../functions/formatTime'

const Comment = (props) => {
  return (
    <section className='comment'>
      <p className='comment-text'>{props.comment.text}</p>
      <p className='comment-poster'> - {props.comment.author}</p>
      <p className='comment-time'>{formatTime(props.comment.createdAt.seconds + '000')}</p>
      { props.comment.uid === props.browser.uid ?
      <button className='comment-delete-button'>Delete</button>
       : null }
    </section>
  )
}

export default Comment