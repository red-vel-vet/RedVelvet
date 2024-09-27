import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import '../styles/Home.css';
import '../styles/Guests.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div>
            <img
                src="https://images.unsplash.com/photo-1571118027171-d2e2c56cc926?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Girl Pineapple"
                className="home-image"
            />
            <div className="tagline">
                <p>Choose your events.</p>
                <p>Find your people.</p>
                <p>Orchestrate a takeover!</p>
            </div>
            <div className="button-container">
                <Button 
                    className="button submit" 
                    onClick={() => {console.log("Button clicked!");}}
                >
                    Hosts
                </Button>
                <Button 
                    className="button submit" 
                    onClick={() => navigate('/guests/events')}
                >
                    Guests
                </Button>

            </div>
        </div>
    );
}

export default Home;