
import React from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "h-full flex items-center justify-center p-6",
        className
      )}
    >
      <div className="text-center max-w-sm">
        {icon && <div className="mb-4 flex justify-center">{icon}</div>}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-muted-foreground mb-6">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
};

export default EmptyState;
