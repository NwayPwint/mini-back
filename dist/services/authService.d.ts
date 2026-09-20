import { RegisterInput, LoginInput, ResetPasswordInput, UpdateProfileInput, ChangePasswordInput } from "../validators/authValidator";
export declare const registerService: (data: RegisterInput) => Promise<Omit<{
    id: string;
    email: string;
    password: string;
    name: string | null;
    phone: string | null;
    address: string | null;
    bio: string | null;
    weeklyTargetHours: number;
    role: import(".prisma/client").$Enums.Role;
    passwordResetToken: string | null;
    passwordResetExpires: Date | null;
    passwordChangedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}, "password" | "passwordResetExpires" | "passwordResetToken">>;
export declare const loginService: (data: LoginInput) => Promise<{
    user: Omit<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        phone: string | null;
        address: string | null;
        bio: string | null;
        weeklyTargetHours: number;
        role: import(".prisma/client").$Enums.Role;
        passwordResetToken: string | null;
        passwordResetExpires: Date | null;
        passwordChangedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, "password" | "passwordResetExpires" | "passwordResetToken">;
    token: string;
}>;
export declare const forgotPasswordService: (email: string) => Promise<{
    message: string;
}>;
export declare const resetPasswordService: (data: ResetPasswordInput) => Promise<{
    message: string;
}>;
export declare const getMeService: (userId: string) => Promise<Omit<{
    id: string;
    email: string;
    password: string;
    name: string | null;
    phone: string | null;
    address: string | null;
    bio: string | null;
    weeklyTargetHours: number;
    role: import(".prisma/client").$Enums.Role;
    passwordResetToken: string | null;
    passwordResetExpires: Date | null;
    passwordChangedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}, "password" | "passwordResetExpires" | "passwordResetToken">>;
export declare const updateProfileService: (userId: string, data: UpdateProfileInput) => Promise<Omit<{
    id: string;
    email: string;
    password: string;
    name: string | null;
    phone: string | null;
    address: string | null;
    bio: string | null;
    weeklyTargetHours: number;
    role: import(".prisma/client").$Enums.Role;
    passwordResetToken: string | null;
    passwordResetExpires: Date | null;
    passwordChangedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}, "password" | "passwordResetExpires" | "passwordResetToken">>;
export declare const changePasswordService: (userId: string, data: ChangePasswordInput) => Promise<{
    message: string;
}>;
//# sourceMappingURL=authService.d.ts.map