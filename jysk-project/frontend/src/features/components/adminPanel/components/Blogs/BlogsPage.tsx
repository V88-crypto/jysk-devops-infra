import { Route, Routes, useNavigate, useParams } from 'react-router-dom'

import { BlogsList } from './BlogsList'
import { EditBlogForm } from './EditBlogForm'

const EditBlogRoute = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <EditBlogForm
      postId={Number(id)}
      onBack={() => navigate('/blogs')}
      onSaved={() => navigate('/blogs')}
    />
  )
}

const BlogsListRoute = () => {
  const navigate = useNavigate()

  return <BlogsList onEdit={(id) => navigate(`/blogs/${id}/edit`)} />
}

export const BlogsPage = () => {
  return (
    <Routes>
      <Route index element={<BlogsListRoute />} />
      <Route path=":id/edit" element={<EditBlogRoute />} />
    </Routes>
  )
}
