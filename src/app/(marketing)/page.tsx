import Link from "next/link"
import Image from "next/image"
import {ArrowDown, DollarSignIcon, Shield} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Header} from "@/components/header";
import {Footer} from "@/components/footer";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

export default async function LandingPage() {
	const session = await getServerSession(authOptions)
	return (
		<div className="flex min-h-screen flex-col">
			{/* Navigation */}
			<Header session={session}/>

			{/* Hero Section */}
			<section className="bg-[#1e2738] py-20 text-white">
				<div className="container flex flex-col items-center justify-center space-y-4 text-center">
					<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
						Write Your Value Proposition Here, Include The Main SEO Keyword
					</h1>
					<p className="max-w-[700px] text-lg text-white/80 md:text-xl">
						Explain more here, give users a reason to scroll down.
					</p>
					<div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 mt-6">
						<Button className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white"><Link href="/signup">Sign Up!</Link></Button>
						<Button variant="outline" className="h-12 px-8 border-white/20 text-white hover:bg-white/10">
							TRY DEMO
						</Button>
					</div>
				</div>
			</section>

			{/* App Screenshot Section */}
			<section className="bg-[#1e2738] pb-20">
				<div className="container flex justify-center">
					<div className="relative w-full max-w-4xl overflow-hidden rounded-t-lg">
						<Image
							src="/preview.png?height=600&width=1200"
							alt="App Screenshot"
							width={1200}
							height={600}
							className="w-full object-cover"
						/>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20">
				<div className="container">
					<h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
						Key Features
					</h2>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						{[
							{
								title: "Feature One",
								description:
									"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
								icon: <DollarSignIcon className='size-6 rounded-full text-primary' strokeWidth={2} />,
							},
							{
								title: "Feature Two",
								description:
									"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
								icon: <ArrowDown className='size-6 rounded-full text-primary' strokeWidth={2} />,
							},
							{
								title: "Feature Three",
								description:
									"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
								icon: <Shield className='size-6 rounded-full text-primary' strokeWidth={2} />,
							},
						].map((feature, index) => (
							<div
								key={index}
								className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm"
							>
								<div className="mb-4 rounded-full bg-primary/10 p-3">{feature.icon}</div>
								<h3 className="text-xl font-bold mb-2">{feature.title}</h3>
								<p className="text-muted-foreground">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-900">
				<div className="container">
					<h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
						Simple, Transparent Pricing
					</h2>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						{[
							{
								title: "Starter",
								price: "$9",
								description: "Perfect for individuals and small projects",
								features: ["1 user", "10 projects", "5GB storage", "Basic support", "48-hour response time"],
								cta: "Get Started",
								highlighted: false,
							},
							{
								title: "Pro",
								price: "$29",
								description: "Ideal for growing teams and businesses",
								features: [
									"5 users",
									"50 projects",
									"50GB storage",
									"Priority support",
									"24-hour response time",
									"Advanced analytics",
								],
								cta: "Get Started",
								highlighted: true,
							},
							{
								title: "Enterprise",
								price: "$99",
								description: "For large organizations with complex needs",
								features: [
									"Unlimited users",
									"Unlimited projects",
									"500GB storage",
									"24/7 support",
									"1-hour response time",
									"Advanced analytics",
									"Custom integrations",
								],
								cta: "Contact Sales",
								highlighted: false,
							},
						].map((plan, index) => (
							<div
								key={index}
								className={`flex flex-col rounded-lg ${
									plan.highlighted
										? "bg-primary text-primary-foreground shadow-lg scale-105"
										: "bg-card text-card-foreground"
								} p-8`}
							>
								<h3 className="text-2xl font-bold">{plan.title}</h3>
								<div className="mt-4 flex items-baseline">
									<span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
									<span className="ml-1 text-sm font-medium">/month</span>
								</div>
								<p className="mt-4 text-sm">{plan.description}</p>
								<ul className="mt-6 space-y-3">
									{plan.features.map((feature, featureIndex) => (
										<li key={featureIndex} className="flex">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="mr-2 h-5 w-5"
											>
												<path d="M20 6 9 17l-5-5" />
											</svg>
											<span className="text-sm">{feature}</span>
										</li>
									))}
								</ul>
								<div className="mt-8">
									<Button
										className={`w-full ${
											plan.highlighted
												? "bg-white text-primary hover:bg-white/90"
												: "bg-primary text-primary-foreground hover:bg-primary/90"
										}`}
									>
										{plan.cta}
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-20">
				<div className="container">
					<h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
						What Our Customers Say
					</h2>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
						{[
							{
								quote:
									"Houston has transformed how we manage our projects. The interface is intuitive and the features are exactly what we needed.",
								author: "Sarah Johnson",
								role: "Product Manager, TechCorp",
							},
							{
								quote:
									"We've tried many solutions, but Houston stands out with its simplicity and powerful features. It's been a game-changer for our team.",
								author: "Michael Chen",
								role: "CTO, StartupX",
							},
							{
								quote:
									"The customer support is exceptional. Any time we've had questions, the team has been quick to respond and incredibly helpful.",
								author: "Emily Rodriguez",
								role: "Operations Director, GrowthCo",
							},
						].map((testimonial, index) => (
							<div key={index} className="flex flex-col rounded-lg border bg-card p-6 shadow-sm">
								<div className="flex-1">
									<p className="text-muted-foreground">&#34;{testimonial.quote}&#34;</p>
								</div>
								<div className="mt-6">
									<p className="font-medium">{testimonial.author}</p>
									<p className="text-sm text-muted-foreground">{testimonial.role}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section id="faqs" className="py-20 bg-slate-50 dark:bg-slate-900">
				<div className="container">
					<h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
						Frequently Asked Questions
					</h2>
					<div className="mx-auto max-w-3xl space-y-4">
						{[
							{
								question: "How does the free trial work?",
								answer:
									"Our free trial gives you full access to all features for 14 days. No credit card required. At the end of the trial, you can choose the plan that works best for you.",
							},
							{
								question: "Can I change plans later?",
								answer:
									"Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new rate is prorated for the remainder of your billing cycle. If you downgrade, the new rate takes effect at the next billing cycle.",
							},
							{
								question: "Is there a setup fee?",
								answer:
									"No, there are no setup fees for any of our plans. You only pay the monthly or annual subscription fee.",
							},
							{
								question: "Do you offer discounts for non-profits?",
								answer:
									"Yes, we offer special pricing for non-profit organizations. Please contact our sales team for more information.",
							},
							{
								question: "How secure is my data?",
								answer:
									"We take security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and regularly undergo security audits.",
							},
						].map((faq, index) => (
							<div key={index} className="rounded-lg border bg-card shadow-sm">
								<div className="p-6">
									<h3 className="text-lg font-medium">{faq.question}</h3>
									<p className="mt-2 text-muted-foreground">{faq.answer}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-primary text-primary-foreground">
				<div className="container text-center">
					<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
					<p className="mx-auto mt-4 max-w-[700px] text-lg text-primary-foreground/80">
						Join thousands of satisfied customers who are already using Houston to transform their workflow.
					</p>
					<div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
						<Button className="h-12 px-8 bg-white text-primary hover:bg-white/90">SIGN UP NOW</Button>
						<Button variant="outline" className="h-12 px-8 border-white/20 text-white hover:bg-white/10">
							SCHEDULE A DEMO
						</Button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<Footer />
		</div>
	)
}

