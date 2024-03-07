import { signInWithPopup } from "firebase/auth"
import { auth } from "../../firebase"
import { GoogleAuthProvider } from "firebase/auth"

const provider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential?.accessToken
      const user = result.user
      console.log(user)
    } catch (error: any) {
      console.error(error)
      alert(`Error signing in with Google: ${error.message}`)
    }
  }
  
  export const signOutWithGoogle = async () => {
    try {
      await auth.signOut()
    } catch (error: any) {
      console.error(error)
      alert(`Error signing out with Google: ${error.message}`)
    }
  }