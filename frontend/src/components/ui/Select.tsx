import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

// Simplified Select for basic usage, simulating radix-ui structure for compatibility
const SelectContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
}>({ open: false, setOpen: () => { } })

const Select = ({ children, value, onValueChange }: any) => {
    const [open, setOpen] = React.useState(false)
    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    )
}

const SelectTrigger = ({ className, children }: any) => {
    const { open, setOpen } = React.useContext(SelectContext)
    return (
        <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    )
}

const SelectValue = ({ placeholder }: any) => {
    const { value } = React.useContext(SelectContext)
    // Logic to find label for value would typically go here, simplified to just show placeholder if no value implies empty
    return <span>{value || placeholder}</span>
}

const SelectContent = ({ children, className }: any) => {
    const { open, setOpen } = React.useContext(SelectContext)
    if (!open) return null
    return (
        <div className={cn("absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md animate-in fade-in-80", className)}>
            <div className="p-1">{children}</div>
        </div>
    )
}

const SelectItem = ({ value, children }: any) => {
    const { onValueChange, setOpen } = React.useContext(SelectContext)
    return (
        <div
            onClick={() => {
                onValueChange?.(value)
                setOpen(false)
            }}
            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {/* Check icon if selected */}
            </span>
            {children}
        </div>
    )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
