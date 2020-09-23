import React from 'react';
import ReactDOM from 'react-dom';
import { AppWindow } from "../AppWindow";
import { windowNames } from "../../consts";
import App from "../../modules/likebutton.jsx";

// The desktop window is the window displayed while Fortnite is not running.
// In our case, our desktop window has no logic - it only displays static data.
// Therefore, only the generic AppWindow class is called.
new AppWindow(windowNames.desktop);
