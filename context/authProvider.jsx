import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import Toast from "react-native-toast-message";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email, password) => {
    try {

      await signInWithEmailAndPassword(auth, email, password)
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "User logged in",
        position: "bottom",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error during logging in",
        text2: error.message,
        position: "bottom",
      });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "User logged out succesfully",
        position: "bottom",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error during logging out",
        text2: error.message,
        position: "bottom",
      });
    }
  };

  const register = async (email, password) => {
    if (email && password) {
      try {
        setIsLoading(true);
        await createUserWithEmailAndPassword(auth, email, password);

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "User registered in succesfully",
          position: "bottom",
        });
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error during registration",
          text2: error.message,
          position: "bottom",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
      else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};