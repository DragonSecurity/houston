"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
	children: ReactNode
	fallback?: ReactNode
}

interface ErrorBoundaryState {
	hasError: boolean
	error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		// You can log the error to an error reporting service here
		console.error("Error caught by ErrorBoundary:", error, errorInfo)
	}

	render(): ReactNode {
		if (this.state.hasError) {
			// If a custom fallback is provided, use it
			if (this.props.fallback) {
				return this.props.fallback
			}

			// Otherwise, use the default fallback UI
			return (
				<Card className="w-full">
					<CardHeader>
						<div className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-amber-500" />
							<CardTitle>Something went wrong</CardTitle>
						</div>
						<CardDescription>An error occurred while rendering this component</CardDescription>
					</CardHeader>
					<CardContent>
						{this.state.error && (
							<div className="text-sm text-muted-foreground">
								<p className="font-medium">Error:</p>
								<pre className="mt-2 rounded-md bg-slate-950 p-4 overflow-x-auto">
                  <code className="text-white">{this.state.error.message}</code>
                </pre>
							</div>
						)}
					</CardContent>
					<CardFooter>
						<Button variant="outline" onClick={() => this.setState({ hasError: false, error: undefined })}>
							Try again
						</Button>
					</CardFooter>
				</Card>
			)
		}

		return this.props.children
	}
}

