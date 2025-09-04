export const getStoredArray = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const setStoredArray = (key, arr) => {
  try {
    localStorage.setItem(key, JSON.stringify(arr))
  } catch {}
}

export const addPost = (post) => {
  const list = getStoredArray('posts')
  const id = Date.now()
  const newPost = { id, timeAgo: new Date().toISOString(), isLiked: false, comments: 0, ...post }
  list.unshift(newPost)
  setStoredArray('posts', list)
  return newPost
}

export const addReview = (review) => {
  const list = getStoredArray('reviews')
  const id = Date.now()
  const newReview = { id, timeAgo: new Date().toISOString(), ...review }
  list.unshift(newReview)
  setStoredArray('reviews', list)
  return newReview
}

export const getPostById = (id) => getStoredArray('posts').find(p => String(p.id) === String(id))
export const getReviewById = (id) => getStoredArray('reviews').find(r => String(r.id) === String(id))

