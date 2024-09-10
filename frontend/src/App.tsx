import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, Box } from '@mui/material';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { backend } from 'declarations/backend';

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    const body = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    try {
      const result = await backend.createPost(title, body, author);
      if ('ok' in result) {
        setShowNewPostForm(false);
        setTitle('');
        setAuthor('');
        setEditorState(EditorState.createEmpty());
        fetchPosts();
      } else {
        console.error('Error creating post:', result.err);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h2" component="h1" gutterBottom>
        Crypto Blog
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowNewPostForm(!showNewPostForm)}
        style={{ marginBottom: '20px' }}
      >
        {showNewPostForm ? 'Cancel' : 'New Post'}
      </Button>
      {showNewPostForm && (
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>
            Create New Post
          </Typography>
          <Box mb={2}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
          </Box>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreatePost}
            style={{ marginTop: '10px' }}
          >
            Create Post
          </Button>
        </Box>
      )}
      {loading ? (
        <CircularProgress />
      ) : (
        posts.map((post) => (
          <Box key={Number(post.id)} mb={4} p={2} bgcolor="#f9f9f9" borderRadius={2}>
            <Typography variant="h4" gutterBottom>
              {post.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              By {post.author} | {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
            </Typography>
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
          </Box>
        ))
      )}
    </Container>
  );
};

export default App;