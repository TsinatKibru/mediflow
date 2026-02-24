import { useAuthStore } from '@/store/authStore';

/**
 * Returns the clinic's primary brand color and a helper to generate
 * rgba values with opacity for use in inline styles.
 */
export function useBrandColor() {
    const primaryColor = useAuthStore((state) => state.tenant?.primaryColor) || '#4f46e5';

    /** Returns an rgba string for the brand color at the given opacity (0-1). */
    const brandAlpha = (alpha: number): string => {
        // Parse hex to RGB
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(primaryColor);
        if (!result) return `rgba(79, 70, 229, ${alpha})`;
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return { brandColor: primaryColor, brandAlpha };
}
