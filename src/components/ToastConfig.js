import toast from "react-hot-toast";

// Pre-configured toast helpers — call these from any component
export const showSuccess = (message) => toast.success(message, { duration: 3000, position: "top-right" });
export const showError = (message) => toast.error(message, { duration: 4000, position: "top-right" });
export const showInfo = (message) => toast(message, { duration: 2500, position: "top-right" });
export const showPromise = (promise, { loading, success, error }) =>
  toast.promise(promise, { loading, success, error }, { position: "top-right" });

// Default Toaster props — used in App.js
export const toasterOptions = {
  position: "top-right",
  toastOptions: {
    duration: 3000,
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
      fontSize: "14px",
    },
    success: { iconTheme: { primary: "#28a745", secondary: "#fff" } },
    error: { iconTheme: { primary: "#dc3545", secondary: "#fff" } },
  },
};
