/**
 * for backend request.
 * As long as the variable name matches the backend json, the value will auto get mapped.
 */
export interface ResponseLogin {
  auth_token: string,
  isLoginSuccess: boolean
}
