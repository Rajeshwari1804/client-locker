export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-black text-foreground">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
          ClientLocker
        </h1>
        <p className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
          Hello
        </p>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          A private file locker where each person sees only the client files they
          are allowed to see.
        </p>
      </div>
    </main>
  );
}
