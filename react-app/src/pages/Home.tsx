import { useAuth } from "../providers/AuthProvider";

const Home = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1>Home Page</h1>
            <p>🚧 Work in progress</p>
            <p>Welcome {user?.name}</p>
            <p>Email: {user?.email}</p>
        </div>
    )
}

export default Home;