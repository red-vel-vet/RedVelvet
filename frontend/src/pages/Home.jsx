import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import styles from '../styles/Home.module.css'; // Import Home styles

const Home = () => {
    const navigate = useNavigate();

    return (
        <div>
            <img
                src="https://images.unsplash.com/photo-1571118027171-d2e2c56cc926?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Girl Pineapple"
                className={styles.homeImage} 
            />
            <div className={styles.tagline}>
                <p>Choose your events.</p>
                <p>Find your people.</p>
                <p>Orchestrate a takeover!</p>
            </div>
            <div className={styles.homeButtonContainer}>
                <Button 
                    variant="submit"  // Pass the variant prop
                    onClick={() => {
                        alert("Host path under development. See guest path.");
                    }}
                >
                    Hosts
                </Button>
                <Button 
                    variant="submit"  // Pass the variant prop
                    onClick={() => navigate('/guests/events')}
                >
                    Guests
                </Button>
            </div>
        </div>
    );
}

export default Home;