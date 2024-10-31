import Header from "~/components/header";

export default function Layout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-[840px] flex-col gap-4 px-4 py-6">
      <Header />
      {children}
    </div>
  );
}
