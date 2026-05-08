import {useState, useEffect} from "react"
import "./App.css"

const CHECKS = [
	"Docker image built",
	"Container started",
	"Traefik route active",
	"HTTP 200 OK",
	"Assets loaded",
]

const LOG = [
	"> cloning repository...",
	"> detected react app profile",
	"> building docker image...",
	"> starting container...",
	"> traefik route registered",
	"> deployment successful ✓",
]

export default function App() {
	const [logLines, setLogLines] = useState<string[]>([LOG[0]])

	useEffect(() => {
		let i = 1
		const id = setInterval(() => {
			if (i >= LOG.length) {
				clearInterval(id)
				return
			}
			setLogLines((prev) => [...prev, LOG[i++]])
		}, 1200)
		return () => clearInterval(id)
	}, [])

	return (
		<div className="root">
			<header>
				<span className="badge">React 19</span>
				<span className="badge dim">+ Vite 8</span>
				<span className="status-dot" />
				<span className="status-text">live</span>
			</header>

			<main>
				<div className="hero">
					<div className="fw-label">REACT12</div>
					<div className="prompt-line">
						<span className="prompt">~/deploy$</span>
						<span className="cmd"> test-react-deploy-app</span>
						<span className="cursor">█</span>
					</div>
					<h1>
						Deployment
						<br />
						<span className="accent">Successful</span>
					</h1>
					<p>
						Тестовый макет для проверки развёртывания.
						<br />
						Собран и запущен через deploy-service + Traefik.
					</p>
				</div>

				<div className="grid">
					<div className="card checks">
						<h2>Checklist</h2>
						{CHECKS.map((c) => (
							<div key={c} className="check">
								<span className="tick">✓</span>
								{c}
							</div>
						))}
					</div>

					<div className="card terminal">
						<div className="term-bar">
							<span className="dot r" />
							<span className="dot y" />
							<span className="dot g" />
							<span className="term-title">deploy output</span>
						</div>
						<div className="term-body">
							{logLines.map((l, i) => (
								<div key={i}>{l}</div>
							))}
							{logLines.length < LOG.length && (
								<span className="cursor">_</span>
							)}
						</div>
					</div>
				</div>
			</main>

			<footer>
				<span>React 19</span>
				<span>Vite 8</span>
				<span>Nginx alpine</span>
				<span>Traefik v3</span>
			</footer>
		</div>
	)
}
