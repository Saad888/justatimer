import { signInWithPopup } from "firebase/auth"
import { auth } from "../firebase"
import { GoogleAuthProvider } from "firebase/auth"

const provider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
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