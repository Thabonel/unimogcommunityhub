import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AccessibleButtonProps extends ButtonProps {
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
  ariaControls?: string;
  ariaDescribedBy?: string;
  ariaLive?: "polite" | "assertive" | "off";
  loadingText?: string;
}

/**
 * Accessible button component with enhanced ARIA support
 */
const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      className,
      disabled,
      children,
      ariaLabel,
      ariaPressed,
      ariaExpanded,
      ariaControls,
      ariaDescribedBy,
      ariaLive,
      loadingText = "Loading...",
      ...props
    },
    ref
  ) => {
    // Add focus visible styles for keyboard navigation
    const accessibleClassName = cn(
      "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
      "focus-visible:outline-none",
      className
    );

    return (
      <Button
        ref={ref}
        className={accessibleClassName}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-describedby={ariaDescribedBy}
        aria-live={ariaLive}
        aria-busy={props.loading}
        {...props}
      >
        {props.loading ? (
          <span className="sr-only">{loadingText}</span>
        ) : null}
        {children}
      </Button>
    );
  }
);

AccessibleButton.displayName = "AccessibleButton";

export { AccessibleButton };