"use client";

type CollectionDescriptionProps = {
  title: string;
  paragraphs: string[];
};

export function CollectionDescription({
  title,
  paragraphs,
}: CollectionDescriptionProps) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 py-10 md:py-12 desktop:py-20">
      <div className="flex flex-col desktop:flex-row desktop:justify-end gap-6 desktop:gap-0">
        <h2 className="text-[22px] md:text-[28px] desktop:text-[32px] font-medium leading-[1.1] text-[var(--color-foreground)] desktop:w-[635px] desktop:shrink-0">
          {title}
        </h2>
        <div className="flex flex-col gap-4 desktop:max-w-[945px]">
          {paragraphs.map((text, i) => (
            <p
              key={i}
              className="text-sm desktop:text-base leading-[1.3] text-[var(--color-dark)]"
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
