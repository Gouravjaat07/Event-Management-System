import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  // ❌ Not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // ❌ Logged in but wrong role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;



// // origional file
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//     const { user, loading } = useAuth();

//     if(loading) {
//         return null;
//     }

//     if(!user) {
//         return <Navigate to="/login" replace/>
//     }

//     if(allowedRoles && !allowedRoles.includes(user.role)) {
//         return <Navigate to="/" replace />;
//     }

//     return children;
// };


// export default ProtectedRoute;