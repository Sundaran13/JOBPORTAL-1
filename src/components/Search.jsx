import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Card,
  Grid,
  Typography,
  Button,
  TextField,
  IconButton,
  Container,
  Fab,
  Drawer,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const Search = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    postId: "",
    postProfile: "",
    postDesc: "",
    reqExperience: "",
    postTechStack: [],
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/jobPosts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  const fetchFilteredPosts = async (keyword) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/jobPost/keyword/${keyword}`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching filtered job posts:", error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8080/jobPost/${postId}`);
      fetchAllPosts();
    } catch (error) {
      console.error("Error deleting job post:", error);
    }
  };

  const addPost = async () => {
    try {
      await axios.post("http://localhost:8080/jobPost", newPost);
      fetchAllPosts();
      resetForm();
      setDrawerOpen(false);
    } catch (error) {
      console.error("Error adding job post:", error);
    }
  };

  const updatePost = async () => {
    try {
      await axios.put("http://localhost:8080/jobPost", newPost);
      fetchAllPosts();
      resetForm();
      setDrawerOpen(false);
    } catch (error) {
      console.error("Error updating job post:", error);
    }
  };

  const resetForm = () => {
    setNewPost({
      postId: "",
      postProfile: "",
      postDesc: "",
      reqExperience: "",
      postTechStack: [],
    });
    setEditMode(false);
  };

  const handleSearchChange = (event) => {
    const keyword = event.target.value;
    setSearchKeyword(keyword);
    if (keyword) {
      fetchFilteredPosts(keyword);
    } else {
      fetchAllPosts();
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", paddingBottom: "40px" }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: "#fff", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <Toolbar>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              color: "#333",
              fontWeight: "bold",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            Job Portal
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Container */}
      <Container maxWidth="lg" sx={{ paddingTop: "40px" }}>
        {/* Search Bar */}
        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
          <TextField
            label="Search for Jobs"
            variant="outlined"
            value={searchKeyword}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon sx={{ color: "#333" }} />
                </IconButton>
              ),
            }}
            sx={{
              borderRadius: "8px",
              backgroundColor: "#fff",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              "& .MuiOutlinedInput-root": {
                color: "#333",
                "& fieldset": {
                  borderColor: "#ccc",
                },
              },
            }}
          />
        </Box>

        {/* Instructional Text */}
        <Box sx={{ textAlign: "center", marginBottom: "30px" }}>
          <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: "bold" }}>
            Want to add a job post?
          </Typography>
          <Typography variant="body1" sx={{ color: "#666" }}>
            Click the floating button below to add a new job post to the portal.
          </Typography>
        </Box>

        {/* Job Posts Grid */}
        <Grid container spacing={3} sx={{ paddingTop: "20px" }}>
          {posts.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.postId}>
              <Card
                sx={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                  {p.postProfile}
                </Typography>
                <Typography sx={{ color: "#666", marginBottom: "12px" }}>
                  {p.postDesc}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "#888" }}>Tech: {p.postTechStack.join(", ")}</Typography>
                  <Typography sx={{ color: "#888" }}>Experience: {p.reqExperience} years</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                  <IconButton
                    sx={{ color: "#f44336" }}
                    onClick={() => deletePost(p.postId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    sx={{ color: "#ff9800" }}
                    onClick={() => {
                      setEditMode(true);
                      setNewPost(p);
                      setDrawerOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Add Job Floating Action Button */}
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#1976d2",
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
          onClick={() => {
            setEditMode(false);
            setDrawerOpen(true);
          }}
        >
          <AddCircleOutlineIcon />
        </Fab>

        {/* Drawer for Add/Edit Job */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: "400px",
              padding: "20px",
              backgroundColor: "#fff",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
              {editMode ? "Edit Job Post" : "Add New Job Post"}
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon sx={{ color: "#333" }} />
            </IconButton>
          </Box>
          <Divider sx={{ marginBottom: "20px" }} />
          <TextField
            label="Post ID"
            variant="outlined"
            value={newPost.postId}
            onChange={(e) => setNewPost({ ...newPost, postId: e.target.value })}
            fullWidth
            disabled={editMode}
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              "& .MuiOutlinedInput-root": {
                color: "#333",
                "& fieldset": {
                  borderColor: "#ccc",
                },
              },
            }}
          />
          <TextField
            label="Job Profile"
            variant="outlined"
            value={newPost.postProfile}
            onChange={(e) => setNewPost({ ...newPost, postProfile: e.target.value })}
            fullWidth
            sx={{ marginTop: "20px" }}
          />
          <TextField
            label="Description"
            variant="outlined"
            value={newPost.postDesc}
            onChange={(e) => setNewPost({ ...newPost, postDesc: e.target.value })}
            fullWidth
            sx={{ marginTop: "20px" }}
          />
          <TextField
            label="Required Experience (Years)"
            variant="outlined"
            value={newPost.reqExperience}
            onChange={(e) => setNewPost({ ...newPost, reqExperience: e.target.value })}
            fullWidth
            sx={{ marginTop: "20px" }}
          />
<TextField
  label="Tech Stack (comma separated)"
  variant="outlined"
  value={newPost.postTechStack.join(", ")} // Display current tech stack as a comma-separated string
  onChange={(e) => setNewPost({ ...newPost, postTechStack: e.target.value.split(",").map(item => item.trim()) })}
  fullWidth
  sx={{
    marginTop: "20px",
    backgroundColor: "#fff",
    "& .MuiOutlinedInput-root": {
      color: "#333",
    },
  }}
/>


          <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={editMode ? updatePost : addPost}
            >
              {editMode ? "Update Job" : "Add Job"}
            </Button>
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
};

export default Search;
