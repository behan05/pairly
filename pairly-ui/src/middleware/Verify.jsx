import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setError, setLoading, setUser } from '../redux/slices/auth/authSlice';
import { useDispatch } from "react-redux";

export default function Verify() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true));

        const params = new URLSearchParams(window.location.search);
        const userData = params.get('userData');

        if (userData) {
            try {
                // decode & parse object
                const parsed = JSON.parse(decodeURIComponent(userData));

                const { token, user, authProvider } = parsed;

                dispatch(setUser({ user, token, authProvider }));

                // save token in localStorage
                localStorage.setItem('token', token);

                dispatch(setLoading(false));

                // redirect to dashboard
                navigate('/pairly', { replace: true });
            } catch (err) {
                dispatch(setLoading(false));
                dispatch(setError("Invalid user data"));
            }
        } else {
            dispatch(setLoading(false));
            dispatch(setError("No user data found"));
        }
    }, [navigate, dispatch]);

    return <p>Verifying login...</p>;
}
