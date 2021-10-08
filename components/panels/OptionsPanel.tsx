import { DomainOptionSection, LogoOptionSection } from '@/components';
// import type { SiteType } from '@/lib/types';

// type OptionsPanelProps = {
//   site: SiteType;
// };

const OptionsPanel = () => {
  return (
    <>
      <LogoOptionSection />
      <DomainOptionSection />
    </>
  );
};

export default OptionsPanel;
