import Footer from "@/components/shared/footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";


export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
