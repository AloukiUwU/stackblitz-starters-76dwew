import React from "react";
import { Route, Routes } from "react-router-dom";
import { AddG } from "./screens/AddG";
import { AddR } from "./screens/AddR";
import { Home } from "./screens/Home";
import { Login } from "./screens/Login";
import { Signup } from "./screens/Signup";
import { Dashboard } from "./screens/Dashboard";
import { Group } from "./screens/Group";
import { Reminder } from "./screens/Reminder";
import { EditG } from "./screens/EditG";
import { EditR } from "./screens/EditR";


function App() {
//Voici les différentes routes possibles
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="login" element={<Login/>}></Route>
        <Route path="signup" element={<Signup />}></Route>
        <Route path="dashboard" element={<Dashboard/>}></Route>
        <Route path="group/:id" element={<Group/>}></Route>
        <Route path="reminder/:id" element={<Reminder/>}></Route>
        <Route path="group/new" element={<AddG/>}></Route>
        <Route path="group/:id/edit" element={<EditG/>}></Route>
        <Route path="reminder/new" element={<AddR/>}></Route>
        <Route path="reminder/:id/edit" element={<EditR/>}></Route>
      </Routes>
    </div>
  )
}

export default App
