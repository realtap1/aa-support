export type Post = {
    id: string
    postId: string
    author: string
    fileCid: string
    text: string
    parentId: string
    blockNumber: number
    blockTimestamp: string
    transactionHash: string
    likes?: number
    boosts?: number
    isLiked?: boolean
    isBoosted?: boolean
    comments?: Post[]
    user?: User
  }

export type User = {
  id: string
  username: string
  avatarCID: string
  bio: string
  createdAt: string
  updatedAt: string
}

export type PostStats = {
  likes: number
  boosts: number
  comments: number
}