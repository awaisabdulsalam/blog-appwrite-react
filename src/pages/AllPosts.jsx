import React, { useEffect, useState } from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config"

const AllPosts = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {}, []);
    
//?  getPosts() method applies filter by providing empty array we are telling
//?  it don't apply any filter give me all documents
    appwriteService.getPosts().then((posts) => {
        if (posts) {
            setPosts(posts.documents)
        }
    });

    console.log(posts);
    
  return (
    <div className='w-full py-8'>
        <Container>
            <div className='flex flex-wrap'>
                {posts.map((post) => (
                    <div key={post.$id} className='p-2 w-1/4'>
                        <PostCard $id={post.$id} title={post.title} featuredimage={post.featuredimage} />
                    </div>
                ))}
            </div>
        </Container>
    </div>
  )
}

export default AllPosts