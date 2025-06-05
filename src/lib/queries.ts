import { gql } from "@apollo/client"

export const GET_POSTS = gql`
  query GetPosts($first: Int!, $skip: Int!) {
    postCreateds(
      first: $first
      skip: $skip
      orderBy: blockTimestamp
      orderDirection: desc
      where: { parentId: "0" }
    ) {
      id
      postId
      author
      text
      fileCid
      parentId
      blockNumber
      blockTimestamp
      transactionHash
    }
    postLikeds {
      id
      postId
      user
    }
  }
`

export const GET_POST_COMMENTS = gql`
  query GetPostComments($postId: String!) {
    postCreateds(
      where: { parentId: $postId }
      orderBy: blockTimestamp
      orderDirection: asc
    ) {
      id
      postId
      author
      text
      fileCid
      parentId
      blockTimestamp
      transactionHash
    }
    postLikeds {
      id
      postId
    }
  }
`

export const GET_USER_PROFILE = gql`
  query GetUserProfile($address: String!) {
    user(id: $address) {
      id
      username
      bio
      avatarCID
      createdAt
      updatedAt
    }
  }
`

export const GET_USER_POSTS = gql`
  query GetUserPosts($first: Int!, $skip: Int!, $author: String!) {
    postCreateds(
      first: $first
      skip: $skip
      orderBy: blockTimestamp
      orderDirection: desc
      where: { 
        author: $author,
        parentId: "0" 
      }
    ) {
      id
      postId
      author
      text
      fileCid
      parentId
      blockNumber
      blockTimestamp
      transactionHash
    }
    postLikeds {
      id
      postId
      user
    }
  }
`

export const SEARCH_USERS = gql`
  query SearchUsers($searchQuery: String!) {
    users(
      where: { username_contains: $searchQuery }
      first: 10
    ) {
      id
      username
      bio
      avatarCID
    }
  }
`

export const SEARCH_POSTS = gql`
  query SearchPosts($searchQuery: String!) {
    postCreateds(
      where: { text_contains: $searchQuery }
      orderBy: blockTimestamp
      orderDirection: desc
      first: 10
    ) {
      id
      postId
      author
      text
      fileCid
      parentId
      blockNumber
      blockTimestamp
      transactionHash
    }
    postLikeds {
      id
      postId
      user
    }
  }
`

export const GET_FOLLOW_STATUS = gql`
  query GetFollowStatus($follower: String!) {
    followings(where: { follower: $follower }) {
      id
      follower
      following
    }
  }
`

export const GET_POST_DETAILS = gql`
  query GetPostDetails($postId: String!) {
    postCreateds(
      where: {
        or: [
          { postId: $postId },
          { parentId: $postId }
        ]
      }
      orderBy: blockTimestamp
      orderDirection: asc
    ) {
      id
      postId
      author
      text
      fileCid
      parentId
      blockNumber
      blockTimestamp
      transactionHash
    }
    # Get all replies to any post in the thread
    allReplies: postCreateds(
      where: {
        parentId_not: "0"
      }
      orderBy: blockTimestamp
      orderDirection: asc
    ) {
      id
      postId
      author
      text
      fileCid
      parentId
      blockNumber
      blockTimestamp
      transactionHash
    }
    postLikeds(where: { postId: $postId }) {
      id
      postId
      user
    }
  }
`

export const GET_TOKEN_CREATED = gql`
  query GetTokenCreated($creator: String!, $createdAfter: BigInt!) {
    tokenCreateds(
      where: { 
        creator: $creator,
        createdAt_gt: $createdAfter
      }
      orderBy: createdAt
      orderDirection: desc
      first: 1
    ) {
      id
      tokenAddress
      creator
      createdAt
    }
  }
`
