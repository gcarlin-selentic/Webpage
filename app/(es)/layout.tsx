import { localeMetadata, RootDocument } from "@/components/RootDocument";

export const metadata = localeMetadata("es");
export { viewport } from "@/components/RootDocument";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale="es">{children}</RootDocument>;
}
