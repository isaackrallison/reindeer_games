import AuthButton from "@/app/components/AuthButton";
import EventList from "@/app/components/EventList";
import EventModal from "@/app/components/EventModal";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const code = params.code as string | undefined;
  const error = params.error as string | undefined;

  // If we have a code or error parameter, redirect to callback route
  if (code || error) {
    const queryString = new URLSearchParams();
    if (code) queryString.set("code", code);
    if (error) {
      queryString.set("error", error);
      if (params.error_description) {
        queryString.set("error_description", params.error_description as string);
      }
      if (params.error_code) {
        queryString.set("error_code", params.error_code as string);
      }
    }
    redirect(`/auth/callback?${queryString.toString()}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-reindeer-cream-50">
      <header className="bg-gradient-to-r from-reindeer-navy-900 to-reindeer-navy-800 shadow-lg border-b-4 border-reindeer-gold-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image
                src="/logo-icon.png"
                alt="Reindeer Games"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
              <h1 className="text-3xl font-bold text-reindeer-cream-50 tracking-wide">
                Reindeer Games
              </h1>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-reindeer-navy-900">Possible Events</h2>
          {user && <EventModal />}
        </div>

        <EventList />
      </main>
    </div>
  );
}

