import { lazy, type ComponentType, Suspense, type ReactNode } from "react"

// Type for the props of the component to be lazy loaded
type LazyComponentProps<T> = T extends ComponentType<infer P> ? P : never

/**
 * Creates a lazy-loaded component with a fallback
 * @param factory Function that imports the component
 * @param Fallback Component to show while loading
 * @returns Lazy-loaded component with suspense
 */
export function createLazyComponent<T extends ComponentType<any>>(
	factory: () => Promise<{ default: T }>,
	Fallback: ReactNode = null,
) {
	const LazyComponent = lazy(factory)

	// Return a component that wraps the lazy component in a Suspense
	return function LazyLoadedComponent(props: LazyComponentProps<T>) {
		return (
			<Suspense fallback={Fallback}>
				<LazyComponent {...props} />
		</Suspense>
	)
	}
}

