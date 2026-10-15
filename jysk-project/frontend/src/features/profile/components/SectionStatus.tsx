interface SectionStatusProps {
  children: string
}

export const SectionStatus = ({ children }: SectionStatusProps) => (
  <div
    className="
      w-full
      bg-surface
      border
      border-line
      px-[20px]
      py-[35px]
      text-center
      text-[15px]
      lg:text-[17px]
      text-fg-subtle
    "
  >
    {children}
  </div>
)
