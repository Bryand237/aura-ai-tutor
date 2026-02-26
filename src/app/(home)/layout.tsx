import HeaderNav from "../ui/home/header-nav";
import Footer from "../ui/home/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderNav />
      <main className="mx-auto max-w-7xl px-4">{children}</main>
      <Footer />
    </>
  );
}
