import {
  BundleOffer,
  BeforeAfter,
  Faq,
  ForWho,
  Hero,
  HowItWorks,
  MeetMike,
  NanoSlideTechnology,
} from "@/components/HomeSections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <NanoSlideTechnology />
      <BundleOffer />
      <ForWho />
      <MeetMike />
      <BeforeAfter />
      <Faq />
    </>
  );
}
