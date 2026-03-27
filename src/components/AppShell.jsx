import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HELP_BY_ROUTE } from '../data'
import { useApp } from '../AppContext'
import BottomNav from './BottomNav'
import HelpDrawer from './HelpDrawer'
import ToastStack from './ToastStack'

function getHelpKey(pathname) {
  if (pathname.startsWith('/search')) return 'search'
  if (pathname.startsWith('/topic')) return 'topic'
  if (pathname.startsWith('/related')) return 'related'
  if (pathname.startsWith('/details')) return 'details'
  if (pathname.startsWith('/saved')) return 'saved'
  return 'home'
}

export default function AppShell({ title, children, showBack = false }) {
  const { mode, setMode } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [helpOpen, setHelpOpen] = useState(false)
  const help = HELP_BY_ROUTE[getHelpKey(location.pathname)]

  return (
    <div className="app-background">
      <ToastStack />
      <div className="phone-frame">
        <header className="screen-header">
          <div className="header-row">
            <div className="header-title-row">
              {showBack ? (
                <button className="icon-button icon-soft" onClick={() => navigate(-1)} aria-label="Go back">
                  ←
                </button>
              ) : (
                <div className="icon-spacer" />
              )}
              <div>
                {/* <p className="eyebrow">Medium-fidelity prototype</p> */}
                <h1>{title}</h1>
              </div>
            </div>
            <button className="icon-button icon-soft" onClick={() => setHelpOpen(true)} aria-label="Open help">
              ?
            </button>
          </div>
        </header>

        <main className="screen-body">{children}</main>
        <BottomNav />
      </div>
      {helpOpen && <HelpDrawer help={help} onClose={() => setHelpOpen(false)} />}
    </div>
  )
}
