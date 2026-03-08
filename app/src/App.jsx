import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import "./App.css";

const API_URL = "https://69a341d4be843d692bd34b32.mockapi.io/data/user";

const App = () => {

  const [title,setTitle] = useState("");
  const [content,setContent] = useState("");
  const [author,setAuthor] = useState("");
  const [category,setCategory] = useState("");
  const [image,setImage] = useState("");

  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(false);
  const [search,setSearch] = useState("");

  // FETCH BLOGS
  async function fetchBlogs(){
    try{

      setLoading(true)

      const res = await fetch(API_URL)
      const json = await res.json()

      setData(json.reverse())

    }catch(err){
      toast.error("Failed to fetch blogs")
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchBlogs()
  },[])

  // CREATE BLOG
  async function createBlog(){

    if(!title || !content){
      toast.error("Fill required fields")
      return
    }

    const newBlog = {
      title,
      content,
      author,
      category,
      image,
      likes:0,
      createdAt:new Date().toLocaleDateString()
    }

    try{

      const res = await fetch(API_URL,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(newBlog)
      })

      if(!res.ok) throw new Error()

      toast.success("Blog Created 🚀")

      setTitle("")
      setContent("")
      setAuthor("")
      setCategory("")
      setImage("")

      fetchBlogs()

    }catch{
      toast.error("Create failed")
    }

  }

  // DELETE BLOG
  async function deleteBlog(id){

    try{

      await fetch(`${API_URL}/${id}`,{
        method:"DELETE"
      })

      toast.success("Blog Deleted")

      fetchBlogs()

    }catch{
      toast.error("Delete failed")
    }

  }

  // LIKE BLOG
  async function likeBlog(item){

    const updatedLikes = item.likes + 1

    await fetch(`${API_URL}/${item.id}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        ...item,
        likes:updatedLikes
      })
    })

    fetchBlogs()

  }

  const filteredBlogs = data.filter(blog =>
    blog.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (

    <div className="app">

      <Toaster position="top-right"/>

      <h1 className="heading">
        Premium Blog
      </h1>

      {/* SEARCH */}
      <input
      className="search"
      placeholder="Search blogs..."
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      />

      {/* CREATE BLOG */}

      <div className="form-card">

        <input
        placeholder="Blog Title"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        />

        <input
        placeholder="Author Name"
        value={author}
        onChange={(e)=>setAuthor(e.target.value)}
        />

        <input
        placeholder="Category (Tech, Travel...)"
        value={category}
        onChange={(e)=>setCategory(e.target.value)}
        />

        
        <textarea
        placeholder="Write full blog paragraph..."
        value={content}
        onChange={(e)=>setContent(e.target.value)}
        />

        <button
        className="create-btn"
        onClick={createBlog}
        >
        Publish Blog
        </button>

      </div>

      {/* BLOG LIST */}

      <div className="blog-container">

      {loading ? (

        <p className="empty">Loading blogs...</p>

      ) : filteredBlogs.length === 0 ? (

        <p className="empty">No blogs available</p>

      ) : (

        filteredBlogs.map((item)=>(

          <div key={item.id} className="blog-card">

            {item.image && (
              <img
              src={item.image}
              alt="blog"
              className="blog-image"
              />
            )}

            <h2>{item.title}</h2>

            <p className="meta">
              ✍ {item.author} | 📂 {item.category}
            </p>

            <p className="content">
              {item.content}
            </p>

            <p className="date">
              📅 {item.createdAt}
            </p>

            <div className="actions">

              <button
              className="like"
              onClick={()=>likeBlog(item)}
              >
              ❤️ {item.likes}
              </button>

              <button
              className="delete"
              onClick={()=>deleteBlog(item.id)}
              >
              Delete
              </button>

            </div>

          </div>

        ))

      )}

      </div>

    </div>

  )

}

export default App