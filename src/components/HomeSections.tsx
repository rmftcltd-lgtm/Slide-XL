import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";
import { BundlePricing } from "./BundlePricing";
import { getProductByHandle } from "@/lib/products";

export function Hero() {
  const product = getProductByHandle("pre-launch-bundle")!;

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-hero-floor text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-transparent" />
      <div className="relative mx-auto flex min-h-[92vh] max-w-content flex-col justify-end px-4 pb-16 pt-28 sm:px-6 md:justify-center md:pb-24">
        <div className="max-w-xl">
          <p className="animate-slide-in font-display text-sm font-semibold uppercase tracking-[0.2em] text-khaki">
            Mike the Mop King · USA Pre-Launch
          </p>
          <h1 className="animate-slide-in-delay-1 mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            <span className="block text-white">Slide XL</span>
            <span className="mt-2 block text-3xl font-bold text-khaki sm:text-4xl">
              Pet hair? She&apos;ll be right.
            </span>
          </h1>
          <p className="animate-slide-in-delay-2 mt-5 max-w-md text-lg leading-relaxed text-white/85">
            Sweep, mop, and dry in one go. Hair grabs on — then falls off when
            the head hits water. Built bigger, longer, and purple for American
            floors and Aussie-sized mess.
          </p>
          <div className="animate-slide-in-delay-2 mt-8 flex flex-wrap items-center gap-4">
            <AddToCartButton
              productId={product.id}
              label={`Grab the Bundle — $${product.price.amount}`}
              redirectToCart
            />
          </div>
          <p className="mt-4 text-sm text-white/70">
            Free shipping across the USA · Was ${product.compareAtPrice.amount.toFixed(2)} RRP
          </p>
        </div>
      </div>
      <span
        className="animate-sparkle pointer-events-none absolute right-[12%] top-[22%] hidden text-4xl text-white/80 md:block"
        aria-hidden
      >
        ✦
      </span>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      title: "Sweep",
      body: "The ridged XL head grabs pet hair, dander, dust, and crumbs in one pass — no vacuum warm-up required.",
    },
    {
      title: "Mop",
      body: "Wet it down and the same head washes timber, tile, and sealed floors without leaving a swamp behind.",
    },
    {
      title: "Release",
      body: "Dip the head in water and the hair lets go. Slide-wringer squeezes it clean. Refill when you're ready.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-aussie-wash py-20 sm:py-28">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-purple">
          How Slide XL works
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          One tool. Sweep, mop, dry — hair gone.
        </h2>
        <p className="mt-4 max-w-xl text-ink-muted">
          Same hard-won Aussie thinking that started it all — rebuilt
          with a larger head, longer pole, and a wringer that actually keeps up
          with shedding season.
        </p>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="relative">
              <span className="font-display text-5xl font-extrabold text-purple/20">
                0{i + 1}
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-ink-muted leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-14 overflow-hidden rounded-2xl">
          <Image
            src="/images/mop-action-tile.png"
            alt="Slide XL mop clearing muddy paw prints and pet hair on tile"
            width={1536}
            height={1024}
            className="h-auto w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export function ForWho() {
  const audiences = [
    {
      title: "Pet owners",
      body: "Fur, muddy paws, nose prints — Tamanui-level chaos. Hair releases in water so you're not peeling it off by hand.",
      accent: "bg-purple text-white",
    },
    {
      title: "Timber & tile homes",
      body: "Gentle enough for sealed hardwood and tough enough for grout lines. One pass leaves floors looking newly washed.",
      accent: "bg-timber text-white",
    },
    {
      title: "Barbers & salons",
      body: "Hair on the floor all day. Slide XL picks it up wet or dry and rinses clean between clients.",
      accent: "bg-ocean text-white",
    },
    {
      title: "Busy households",
      body: "Kids, guests, entryways — skip the vacuum-then-mop dance and get the floor done before dinner.",
      accent: "bg-khaki-deep text-white",
    },
  ];

  return (
    <section id="for-who" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-ocean">
          Who it&apos;s for
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Built for pet parents first — brilliant for anyone with floors.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {audiences.map((a) => (
            <article key={a.title} className="border-l-4 border-purple/30 pl-5">
              <span
                className={`inline-block rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${a.accent}`}
              >
                {a.title}
              </span>
              <p className="mt-3 text-ink-muted leading-relaxed">{a.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MeetMike() {
  return (
    <section id="mike" className="overflow-hidden bg-ink py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-content items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div className="relative">
          <Image
            src="/images/mike-tamanui-coast.png"
            alt="Mike the Mop King in Los Angeles with Slide XL"
            width={1051}
            height={1024}
            className="h-auto w-full rounded-2xl object-cover"
          />
          <p className="mt-3 text-sm text-white/55">
            Mike the Mop King — Los Angeles.
          </p>
        </div>
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-khaki">
            The Aussie behind the mop
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Meet Mike the Mop King.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/80">
            Michael Clegg invents like he cleans: no nonsense, plenty of heart,
            and a healthy disrespect for floors that stay filthy. Think
            crocodile-hunter energy — except the wildlife is shedding on your
            timber.
          </p>
          <p className="mt-4 leading-relaxed text-white/70">
            Slide XL has a larger mop head, longer reach, purple-and-white
            finish, and the wrinkles of earlier versions ironed out. Tamanui
            isn&apos;t a prop — he&apos;s the product tester who keeps Mike honest.
          </p>
          <blockquote className="mt-8 border-l-4 border-khaki pl-4 font-display text-xl font-semibold text-khaki">
            &ldquo;If it can handle Tamanui after a beach run, it can handle your
            living room.&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
}

export function BundleOffer() {
  const product = getProductByHandle("pre-launch-bundle")!;

  return (
    <section id="bundle" className="bg-purple-soft py-20 sm:py-28">
      <div className="mx-auto grid max-w-content items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <Image
            src="/images/bundle-flatlay.png"
            alt="Slide XL Pre-Launch Bundle contents: mop, bucket, and four refill heads"
            width={1536}
            height={1024}
            className="h-auto w-full rounded-2xl object-cover shadow-brand"
            priority
          />
        </div>
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-purple">
            Only product on offer
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Pre-Launch Bundle
          </h2>
          <p className="mt-3 text-ink-muted">{product.subtitle}</p>
          <div className="mt-8">
            <BundlePricing product={product} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <AddToCartButton productId={product.id} redirectToCart />
            <Link
              href="/product/pre-launch-bundle"
              className="inline-flex items-center justify-center rounded-md border border-purple/30 bg-white px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-purple transition hover:border-purple"
            >
              Full details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BeforeAfter() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-purple">
              Tamanui-approved
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Muddy paws. Shed hair. Spotless after.
            </h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Tamanui puts Slide XL through real mess — muddy paws, shed hair,
              hallway chaos. If your dog treats the floor like a racetrack, you
              already know why this mop exists.
            </p>
          </div>
          <Image
            src="/images/before-after-tamanui.png"
            alt="Before and after: Tamanui on dirty vs clean tiled floors"
            width={1536}
            height={1024}
            className="h-auto w-full rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  const faqs = [
    {
      q: "What is in the Pre-Launch Bundle?",
      a: "One Slide XL mop with head (RRP $89.95), four additional mop head refills (RRP $24.95 each), and one collapsible wheeled bucket (RRP $29.95). Bundle price $149.95 including shipping across the USA.",
    },
    {
      q: "Why is it ideal for pet owners?",
      a: "The ridged head grabs loose hair as you go. When the head touches water, that hair releases — so rinsing is part of the clean, not an extra chore.",
    },
    {
      q: "Do you ship outside the USA?",
      a: "Not yet. We're launching USA-first with markets structured for Australia, Canada, the UK, and New Zealand next. Stay tuned.",
    },
    {
      q: "Is this related to older Aussie mops?",
      a: "Slide XL is Mike's latest mop — larger head, longer mop, purple & white, and a long list of earlier lessons baked in. It's a new product for a new market.",
    },
  ];

  return (
    <section id="faq" className="bg-aussie-wash py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Questions, answered
        </h2>
        <dl className="mt-10 space-y-8">
          {faqs.map((f) => (
            <div key={f.q}>
              <dt className="font-display text-lg font-semibold text-ink">{f.q}</dt>
              <dd className="mt-2 text-ink-muted leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
