import { create, useStore } from "zustand";
import { devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension";

interface userStoreInterface {
  userLoginStatus: boolean;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  unsavedChanges?: boolean;
  setuserLoginStatus: (userLoggedIn: boolean) => void;
  setFirstname: (firstname: string) => void;
  setLastname: (lastname: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setUnsavedChanges: (unsavedChanges: boolean) => void;
}

const userStore = create<userStoreInterface>()(
  devtools(
    (set) => ({
      userLoginStatus: localStorage.getItem("userLoginStatus") === "true",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      unsavedChanges: false,
      setuserLoginStatus: (userLoginStatus) => {
        set(() => ({ userLoginStatus }));
        localStorage.setItem("userLoginStatus", String(userLoginStatus));
      },
      setFirstname: (firstname: string) => set(() => ({ firstname })),
      setLastname: (lastname: string) => set(() => ({ lastname })),
      setEmail: (email: string) => set(() => ({ email })),
      setPassword: (password: string) => set(() => ({ password })),
      setUnsavedChanges: (unsavedChanges: boolean) =>
        set(() => ({ unsavedChanges })),
    }),
    {
      name: "UserStore",
    }
  )
);

export const useUserStore = () => {
  return useStore(userStore, (state) => ({
    userLoginStatus: state.userLoginStatus,
    firstname: state.firstname,
    lastname: state.lastname,
    email: state.email,
    password: state.password,
    unsavedChanges: state.unsavedChanges,
    setuserLoginStatus: state.setuserLoginStatus,
    setFirstname: state.setFirstname,
    setLastname: state.setLastname,
    setEmail: state.setEmail,
    setPassword: state.setPassword,
    setUnsavedChanges: state.setUnsavedChanges,
  }));
};
