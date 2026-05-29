import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'

const Loading = () => {

  const { path } = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`)
      }, 5000)
      return () => clearTimeout(timer)
    }
  },[])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
      </div>
    </div>
  )
}

export default Loading

