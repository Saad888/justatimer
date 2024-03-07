import { Footer } from './footer'
import { Header } from './header'
import styles from './main.module.scss'

export const MainPage = () => {
  return (
    <div className={styles.content}>
      <Header />
      <h1>Main Page</h1>

      <Footer />
    </div>
  )
}
