import { signInWithPopup } from "firebase/auth"
import { auth } from "../firebase"
import { GoogleAuthProvider } from "firebase/auth"

const provider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (error: any) {
      console.error(error)
    }
  }
  
  export const signOutWithGoogle = async () => {
    try {
      await auth.signOut()
    } catch (error: any) {
      console.error(error)
    }
  }