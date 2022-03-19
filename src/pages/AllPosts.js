import React, {useState} from 'react';
import Post from '../components/Post';

const AllPosts = () => {

  const [allPosts, setAllPosts] = useState([]);

  return (
    <div className='all-posts-page'>
      {allPosts.map((post) => (
        <Post 
        user={post.uid}
        text={post.text}
        createdAt={post.createdAt}
        postId={post.id}
        key={post.id}
        comments={post.comments}
        likes={post.likes}
        dislikes={post.dislikes}
        />
    ))}
    </div>
  )
}

export default AllPosts