
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Healixity",
    template: "%s | Accounts",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-[1440px] max-h-[1024] mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
