import { localeMetadata, RootDocument } from "@/components/RootDocument";

export const metadata = localeMetadata("en");
export { viewport } from "@/components/RootDocument";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
