import { jwtDecode } from 'jwt-decode';

// Function to get ID from token
export const getIdFromToken = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        // Assuming the ID is stored in the 'id' field of the token payload
        const userId = decodedToken.id;
        const userRole = decodedToken.role;
        return { userId, userRole };
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};