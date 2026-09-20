"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excludePassword = void 0;
const excludePassword = (user) => {
    const { password, passwordResetToken, passwordResetExpires, ...rest } = user;
    return rest;
};
exports.excludePassword = excludePassword;
//# sourceMappingURL=excludePassword.js.map