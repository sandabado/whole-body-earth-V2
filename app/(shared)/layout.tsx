import { WholeBodyFooter } from "../components/WholeBodyFooter";

/**
 * Supplies the shared Whole Body footer without mounting any pillar-specific
 * client shell, effects, or route detection.
 */
export default function SharedRoutesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <WholeBodyFooter />
    </>
  );
}
