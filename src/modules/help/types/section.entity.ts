export interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export type SectionMobile = Omit<Section, "icon">;
