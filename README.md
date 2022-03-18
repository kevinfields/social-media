BASIC SOCIAL MEDIA STRUCTURE

USERS:
...from useAuthState(auth):
userId: (string) // user.uid
name: (string) // user.displayName
accountBirthday: (timestamp) // user.metadata.creationTime
lastSignIn: (timestamp) // user.metadata.lastSignIn
email: // user.email
...fields set by user:
bio: (string)
...collections set by user:
friends: [userId]
posts: [postId]
comments: [commentId]
likedPosts: [postId]
dislikedPosts: [postId]
likedComments: [commentId]
dislikedComments: [commentId]

POSTS:
...automatic fields:
userId: (string)
createdAt: (timestamp)
...fields by poster:
post: (string)
...collections:
likes: [userId]
dislikes: [userId]
comments: [commentId]

COMMENTS:
...automatic fields:
userId: (string)
createdAt: (timestamp)
...fields by poster:
comment: (string)
...collections:
likes [userId]
dislikes: [userId]
