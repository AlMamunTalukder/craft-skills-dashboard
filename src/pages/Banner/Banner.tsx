import Loading from "@/app/loading";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import Banner from "@/components/home/Banner";
import { db } from "@/prisma/db";

const page = async () => {
  const banner = await db.banner.findFirst();

  if (!banner) {
    return <Loading />;
  }
  return (
    <div className="space-y-6">
      <TableHeader
        title="Banner"
        linkTitle="Update Banner"
        href="/dashboard/content/banner/update"
        data={[]}
        model="Banner"
        showImport={false}
        showExport={false}
      />

      <Banner data={banner} />
    </div>
  );
};

export default page;
