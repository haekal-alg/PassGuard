import React from 'react';
import "./NotFoundPage.css"
import fred from "./../resource/fred.gif"
import patrick from "./../resource/patrick.gif"

function NotFoundPage(msg) { 
    let displayed_img, message;

    let loc = window.location.pathname;
    loc = (loc === '/') ? 'home' : loc; 

    if (msg.redirect === 'not found') {
        displayed_img = fred;
        message = "404 Page Not Found"
    }
    else if (msg.redirect === 'construction') {
        displayed_img = patrick;
        message = `The ${loc} page is under construction. Try again sometimes.`;
    }

    return (     
        <body class="notfound">
            <img src={displayed_img} alt="Loading..." class="center"/>
            <h1 class="center_h1">Oops!</h1>
            <h1 class="center_h1">{message}</h1>
            {(loc === 'home') && <a href='/login' class="center">psstt.. click here to login</a>}
            {(loc === '/vault') && <a href='/login' class="center">psstt.. click here to logout</a>}
        </body>
    )
}

export default NotFoundPage;