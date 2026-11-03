import type { ReactNode } from 'react'
import { Header } from './Header'
import styles from './Page.module.css'

type PageProps = {
  title: string
  showBack?: boolean
  headerActions?: ReactNode
  children: ReactNode
}

/** Common layout of every screen: sticky header + centered scrollable content. */
export function Page({ title, showBack, headerActions, children }: PageProps) {
  return (
    <>
      <Header title={title} showBack={showBack} actions={headerActions} />
      <main className={styles.content}>{children}</main>
    </>
  )
}
