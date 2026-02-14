import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
    title: "Workflow Builder Lite",
    description: "Chain AI steps to automate your workflow",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script src="https://js.puter.com/v2/"></script>
                <style>{`
          ::selection {
            background-color: oklch(0.6 0.21 254 / 0.2);
            color: oklch(0.6 0.21 254);
          }
        `}</style>
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
