import { Route, Routes, useNavigate, useParams } from 'react-router-dom'

import { BlogsList } from './BlogsList'
import { EditBlogForm } from './EditBlogForm'

const EditBlogRoute = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <EditBlogForm
      postId={Number(id)}
      onBack={() => navigate('/admin/blogs')}
      onSaved={() => navigate('/admin/blogs')}
    />
  )
}

const AddBlogRoute = () => {
  const navigate = useNavigate()

  return (
    <EditBlogForm
      onBack={() => navigate('/admin/blogs')}
      onSaved={() => navigate('/admin/blogs')}
    />
  )
}

const BlogsListRoute = () => {
  const navigate = useNavigate()

  return (
    <BlogsList
      onAdd={() => navigate('/admin/blogs/new')}
      onEdit={(id) => navigate(`/admin/blogs/${id}/edit`)}
    />
  )
}

export const BlogsPage = () => {
  return (
    <Routes>
      <Route index element={<BlogsListRoute />} />
      <Route path="new" element={<AddBlogRoute />} />
      <Route path=":id/edit" element={<EditBlogRoute />} />
    </Routes>
  )
}
