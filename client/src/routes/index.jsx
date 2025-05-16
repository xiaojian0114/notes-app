import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Categories from '../pages/Categories';
import CategoryNotes from '../pages/CategoryNotes';
import Notes from '../pages/Notes';
import Note from '../pages/Note';
import CreateNote from '../pages/CreateNote';
import EditNote from '../pages/EditNote';
import DeleteNote from '../pages/DeleteNote';
import Profile from '../pages/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/notes/categories/:categoryId" element={<CategoryNotes />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/notes/:id" element={<Note />} />
      <Route path="/create-note" element={<CreateNote />} />
      <Route path="/notes/edit/:noteId" element={<EditNote />} />
      <Route path="/notes/delete/:noteId" element={<DeleteNote />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default AppRoutes;
