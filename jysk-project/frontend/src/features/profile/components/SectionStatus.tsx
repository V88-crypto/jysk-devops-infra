interface SectionStatusProps {
  children: string
}

export const SectionStatus = ({ children }: SectionStatusProps) => (
  <div
    className="
      w-full
      bg-white
      border
      border-[#dedede]
      px-[20px]
      py-[35px]
      text-center
      text-[15px]
      lg:text-[17px]
      text-[#777]
    "
  >
    {children}
  </div>
)
