import {
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
    } from "firebase/auth";
    import React, { useEffect, useState } from "react";
    import { useAuthState } from "react-firebase-hooks/auth";
    import {FCGoogle } from "react-icons/fc";
    import { useNavigate } from "react-router-dom";
    import {toast } from "sonner";
    import api from "../libs/apiCall";
    import { auth } from "../libs/firebaseConfig";
    import useStore from "../store";
    import { Button } from "./ui/button";

    export const SocialAuth = ({ isLoading, setLoading }) => {
        const [user] = useAuthState(auth);
      
        const [selectedProvider, setSelectedProvider] = useState("google");
        const { setCredentails } = useStore((state) => state);
      
        const navigate = useNavigate();
      
        const signInWithGoogle = async () => {
          const provider = new GoogleAuthProvider();
      
          setSelectedProvider("google");
          try {
            const res = await signInWithPopup(auth, provider);
          } catch (error) {
            console.error("Error signing in with Google", error);
          }
        };
      
const SignInWithGitHub = async() => {};
      useEffect(() => {
        const saveUserToDb = async () => {
          try {
            setLoading(true);
            const { data: res } = await api.post("/auth/sign-in", userData);
      
            if (res?.user) {
              toast.success(res?.message);
              const userInfo = { ...res?.user, token: res?.token }; // Corrected object creation
              localStorage.setItem("user", JSON.stringify(userInfo));
              setCredentails(userInfo);
              setTimeout(() => {
                navigate("/overview");
              }, 1500);
            }
          } catch (error) {
            console.error("Something went wrong:", error);
            toast.error(error?.response?.data?.message || error.message);
          } finally {
            setLoading(false);
          }
        };
      
        if (user) {
          saveUserToDb();
        }
      }, [user?.uid]);
    }