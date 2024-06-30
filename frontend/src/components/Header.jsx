import userIcon from '../assets/icons/user.svg';
import navIcon from '../assets/icons/nav.svg';
import '../styles/Header.css';

const Header = () => (
    <header className="header">
        <div className="header-left">
            <img src={navIcon} alt="Navigation Icon" className="header-icon" />
            <h1 className="header-title">RED VELVET</h1>
        </div>
        <div className="header-right">
            <img src={userIcon} alt="User Icon" className="header-icon" />
        </div>
    </header>
);

export default Header;