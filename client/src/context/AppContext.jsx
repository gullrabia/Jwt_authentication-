import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    // Global axios setting to ensure cookies (tokens) are sent with every request
    axios.defaults.withCredentials = true;

    // Fetches the full user profile from the database
    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/data`);

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch user"
            );
        }
    };

    // Validates if the user has a valid session token
    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);

            if (data.success) {
                setIsLoggedin(true);
                // After confirming auth, immediately fetch the latest user data
                // This ensures isAccountVerified is current
                await getUserData(); 
            } else {
                setIsLoggedin(false);
                setUserData(null);
            }

        } catch (error) {
            // If the request fails (e.g., token expired), reset the local state
            setIsLoggedin(false);
            setUserData(null);
        }
    };

    // Automatically check authentication state when the app or page is refreshed
    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData // Exported so other components can trigger a data refresh
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};