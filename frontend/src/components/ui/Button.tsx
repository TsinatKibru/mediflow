import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', style, ...props }, ref) => {
        const variants = {
            // primary uses --brand-color via inline style below
            primary: 'text-white shadow-sm',
            secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
            outline: 'border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700',
            ghost: 'hover:bg-slate-100 text-slate-600',
            danger: 'bg-rose-600 text-white hover:bg-rose-700',
        };

        const sizes = {
            sm: 'h-8 px-3 text-xs',
            md: 'h-10 px-4 py-2 text-sm',
            lg: 'h-12 px-6 text-base',
            icon: 'h-10 w-10',
        };

        // Inject brand color as background for primary variant
        const brandStyle =
            variant === 'primary'
                ? {
                    backgroundColor: 'var(--brand-color, #4f46e5)',
                    ...style,
                }
                : style;

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
                    variants[variant],
                    sizes[size],
                    className
                )}
                style={brandStyle}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

export { Button };
