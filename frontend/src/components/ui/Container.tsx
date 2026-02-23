interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Container({
  children,
  className = "",
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={`mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
