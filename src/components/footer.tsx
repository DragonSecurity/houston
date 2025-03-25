import {RocketIcon} from "lucide-react";
import Link from "next/link";

export function Footer() {
	return (
		<footer className="border-t py-12">
			<div className="container">
				<div className="flex flex-col items-center justify-between gap-6 md:flex-row">
					<div className="flex items-center gap-2">
						<div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
							<RocketIcon />
						</div>
						<span className="text-xl font-bold">Houston</span>
					</div>
					<nav className="flex gap-6">
						<Link
							href="#features"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							Features
						</Link>
						<Link
							href="#pricing"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							Pricing
						</Link>
						<Link
							href="#faqs"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							FAQs
						</Link>
						<Link
							href="#contact"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							Contact
						</Link>
					</nav>
					<div className="flex gap-4">
						<Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="h-5 w-5"
							>
								<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
							</svg>
							<span className="sr-only">Facebook</span>
						</Link>
						<Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="h-5 w-5"
							>
								<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
							</svg>
							<span className="sr-only">Twitter</span>
						</Link>
						<Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="h-5 w-5"
							>
								<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
								<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
								<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
							</svg>
							<span className="sr-only">Instagram</span>
						</Link>
					</div>
				</div>
				<div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
					<p>© {new Date().getFullYear()} Houston. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}