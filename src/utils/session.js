export function resetLoginSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
