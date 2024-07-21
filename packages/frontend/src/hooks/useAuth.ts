import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory

const useAuth = (user: any) => {
    const navigate = useNavigate();  // Update to useNavigate

    useEffect(() => {
        if (!user) {
            navigate('/login');  // Update to navigate
        }
    }, [user, navigate]);

    return;
};

export default useAuth;
