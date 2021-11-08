import { createContext } from 'react';

enum Roles {
    ADMIN = "admin",
    STAFF = "staff",
    STUDENT = "student",
    MANAGER = "manager"
};

interface StudentInfo {
    enrollment_no: string,
    batch: string,
    balance: string,
};

export interface User {
    id: string,
    email: string,
    first_name: string,
    last_name: string,
    student_info?: StudentInfo,
    role: Roles
};

const AuthContext = createContext<{
    user: User | null,
    setUser?: React.Dispatch<React.SetStateAction<User | null>>
}>({ user: null });

export default AuthContext;