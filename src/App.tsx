import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Home } from './pages/Home'
import { Looding } from './pages/looding'

const App = () => {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const timer = window.setTimeout(() => {
			setIsLoading(false)
		}, 2300)

		return () => window.clearTimeout(timer)
	}, [])

	return (
		<AnimatePresence mode="wait">
			{isLoading ? <Looding key="loading" /> : <Home key="home" />}
		</AnimatePresence>
	)
}

export default App
