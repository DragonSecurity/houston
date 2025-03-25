import {ReactNode} from "react";
import {Inter} from "next/font/google";

const inter = Inter({ subsets: ["latin"] })

export default function MarketingLayout({
	                                        children,
                                        }: {
	children: ReactNode
}) {
	return <div className={inter.className}>{children}</div>
}