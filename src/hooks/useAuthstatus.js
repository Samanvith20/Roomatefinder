import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

export function useAuthStatus() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        auth.onAuthStateChanged((user) => {
            if (user) {
                setLoggedIn(true);
            }
            else {
                setLoggedIn(false);
            }
            setCheckingStatus(false);
        });
    }, []);

    return { loggedIn, checkingStatus };
}