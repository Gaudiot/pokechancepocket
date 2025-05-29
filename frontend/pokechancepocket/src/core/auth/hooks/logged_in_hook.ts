import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '@/base/firebase/firebase';

export function useIsUserLoggedIn(): boolean {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(getAuth(firebaseApp).currentUser !== null);

    useEffect(() => {
        const auth = getAuth(firebaseApp);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(user !== null);
        });
        return () => unsubscribe();
    }, []);

    return isLoggedIn;
}
