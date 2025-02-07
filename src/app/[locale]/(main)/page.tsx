import { getServerAuthSession } from "@/utils/auth";

async function Page() {
  const auth = await getServerAuthSession();
  console.log("🚀 ~ Page ~ auth:", auth);

  return <main>home page</main>;
}

export default Page;
