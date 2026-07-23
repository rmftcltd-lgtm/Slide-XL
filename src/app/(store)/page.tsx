import {
  BundleOffer,
  BeforeAfter,
  Faq,
  ForWho,
  Hero,
  HowItWorks,
  MeetMike,
} from "@/components/HomeSections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <BundleOffer />
      <ForWho />
      <MeetMike />
      <BeforeAfter />
      <Faq />
    </>
  );
}
