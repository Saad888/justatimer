import { Content } from './content'
import { Footer } from './footer'
import { Header } from './header'
import styles from './main.module.scss'

export const MainPage = () => {
  return (
    <div className={styles.content}>
      <Header />
      <Content />
      <Footer />
    </div>
  )
}
