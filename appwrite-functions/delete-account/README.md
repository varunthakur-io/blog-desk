# Delete Account Function

This Appwrite Function deletes the currently authenticated user and related app data.

## What it deletes

- User profile document
- User avatar file
- User-authored posts
- Post cover images for user-authored posts
- Likes and comments tied to those posts
- User-authored comments
- User-authored likes
- The Appwrite auth user

## Required environment variables

- `APPWRITE_DATABASE_ID`
- `APPWRITE_POSTS_COLLECTION_ID`
- `APPWRITE_LIKES_COLLECTION_ID`
- `APPWRITE_COMMENTS_COLLECTION_ID`
- `APPWRITE_PROFILES_COLLECTION_ID`
- `APPWRITE_BUCKET_ID`

The function runtime also needs Appwrite's built-in variables:

- `APPWRITE_FUNCTION_API_ENDPOINT`
- `APPWRITE_FUNCTION_PROJECT_ID`
- `APPWRITE_FUNCTION_API_KEY`

## Required scopes for the function API key

- `users.write`
- `databases.read`
- `databases.write`
- `files.read`
- `files.write`

## Frontend configuration

Set `VITE_APPWRITE_DELETE_ACCOUNT_FUNCTION_ID` in your app environment to the deployed function ID.

## Invocation

The frontend calls this function through Appwrite `Functions.createExecution(...)`.
Make sure the function's execute permissions allow authenticated users.
