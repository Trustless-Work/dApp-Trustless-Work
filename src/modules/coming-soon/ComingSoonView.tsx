import { FeatureList } from "./FeaturesList";

export const ComingSoonView = () => {
  return (
    <div className="flex min-h-svh flex-col items-center px-6 py-16">
      <div className="flex w-full max-w-6xl flex-col items-center">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Coming Soon
          </p>

          <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
            {"What's next"}
          </h1>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground text-pretty">
            {
              "We're working on features to make your experience faster, smarter, and more powerful. Here's a look at what's ahead."
            }
          </p>
        </div>

        {/* Feature grid */}
        <FeatureList />
      </div>
    </div>
  );
};
