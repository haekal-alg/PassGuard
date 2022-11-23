import "./HomePage.css";
import { useNavigate } from 'react-router-dom';

/* [TODO] resolve this error,
Warning: validateDOMNesting(...): <body> cannot appear as a child of <div>.
*/
function HomePage() {
  const navigate = useNavigate();
  const navigateLogin = () => {
    navigate('/login');
  };

  return (
    <body>
      <div className="topnav">
        <a href="#App" className="app">
          PassGuard
        </a>
        <a href="#About" className="menu">
          About
        </a>
        <a href="#Features" className="menu">
          Features
        </a>
        <a href="#Contact" className="menu">
          Contact
        </a>
        <div className="topnav-right">
          <input type="button" value="login" className="login_button" onClick={navigateLogin} />
        </div>
      </div>
      <div className="main">
        <div className="container">
          <div className="image">
            <img src="https://pic.onlinewebfonts.com/svg/img_201862.png" alt="gembok" width="171" height="177" className="gambar"/>
          </div>
          <div className="about">
            <p className="title">
              Easiest way to secure your password!
            </p>
            <p className="description">
              PassGuard is a password manager designed to securely store
            </p>
            <p className="description">
              and manage sensitive information such as login information,
            </p>
            <p className="description">
              secure notes, as well as card information (Visa, Mastercard, etc.)
            </p>
            <input type="button" value="Get Started" className="get_button" />
          </div>
        </div>
      </div>
      <div className="bot_nav">
          <p>@PassGuard, inc</p>
      </div>
    </body>
  );
}

export default HomePage;
