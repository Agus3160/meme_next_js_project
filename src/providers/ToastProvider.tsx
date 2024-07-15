"use client";

import "react-toastify/dist/ReactToastify.css";
import "@/app/globals.css";
import { ToastContainer } from "react-toastify";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {

  return (
    <>
      {children}
    <ToastContainer
      position="top-right"
      autoClose={3000}
      limit={3}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      className={"z-[10000]"}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      />
    </>
  );
}