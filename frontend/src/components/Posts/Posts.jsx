import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../../styles/styles';
import PostCard from "./PostCard";

const Posts = () => {
  const {allPosts,isLoading} = useSelector((state) => state.posts);  
   
  return (
    <div>
     {
      !isLoading && (
        <div className={`${styles.section}`}>
      <div className={`${styles.heading} text-white`}>
        <h1>Blog</h1>
      </div>

      <div className="w-full grid">
         {
          allPosts.length !== 0 && (
            <PostCard data={allPosts && allPosts[0]} />
          )
         }
         <h4>{
           allPosts?.length === 0 && (
            'No Posts have!'
           )
          }

         </h4>
      </div>
     
    </div>
      )
     }
  </div>
  )
}

export default Posts