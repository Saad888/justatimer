// Login page
import { Button, Grid, Segment } from 'semantic-ui-react'
import { signInWithGoogle } from '../../services/auth'
import { Logo } from 'src/components/logo/logo'

export const LoginPage = () => {
  return (
    <Grid
      textAlign='center'
      style={{ height: '100vh' }}
      verticalAlign='top'
    >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Logo />
        <h2 style={{ textAlign: 'center' }}>Log-in to Continue</h2>

        <Segment inverted>
          <Button color='google plus' onClick={signInWithGoogle}>
            <i className='google icon' /> Sign In with Google
          </Button>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}
