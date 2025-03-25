"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface BaseChartProps {
	title?: string
	description?: string
	className?: string
	children: ReactNode
}

export function BaseChart({ title, description, className, children }: BaseChartProps) {
	return (
		<Card className={cn("w-full", className)}>
			{(title || description) && (
				<CardHeader>
					{title && <CardTitle>{title}</CardTitle>}
					{description && <CardDescription>{description}</CardDescription>}
				</CardHeader>
			)}
			<CardContent>
				<div className="h-[300px] w-full">{children}</div>
			</CardContent>
		</Card>
	)
}

