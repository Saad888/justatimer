// Login page
import { signInWithGoogle, signOutWithGoogle } from '../services/auth'

export const LoginPage = () => {
  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <button onClick={signOutWithGoogle}>Sign out with Google</button>
    </div>
  )
}
